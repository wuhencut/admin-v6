<template>
  <div class="settled-page">
    <el-form inline>
      <el-form-item>
        <el-button class="export-btn" type="primary" @click="$router.back()"
          >返回</el-button
        >
      </el-form-item>
      <el-form-item>
        <p>本月批次号：HZYT{{ time }}</p>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button @click="exportBtnClick(2)">导出打款信息(支付宝）</el-button>
        <el-button @click="exportBtnClick(1)">导出打款信息(银行卡）</el-button>
        <el-button @click="goSettle">结算</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="映兔昵称" prop="cp_nickname"></el-table-column>
      <el-table-column label="映兔ID" prop="cp_id"></el-table-column>
      <el-table-column
        label="签约手机"
        prop="sign_phone_number"
      ></el-table-column>
      <el-table-column label="收款人|证件号">
        <template slot-scope="scope">
          <p>{{ scope.row.payee_name }}</p>
          <p>{{ scope.row.payee_id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope"
          ><p>{{ allAdmin[scope.row.operator_id] }}</p></template
        >
      </el-table-column>
      <el-table-column label="云账户状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.yunzhanghu_status == 1">待签约</el-tag>
          <el-tag type="success" v-if="scope.row.yunzhanghu_status == 2"
            >进行中</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="本次待结算金额">
        <template slot-scope="scope">
          <p v-if="scope.row.unsettled_point">
            {{ scope.row.unsettled_point }}
          </p>
          <p v-else>--</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-show="list.length">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        :current-page="page_id"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="settleDg" width="300px" center>
      <span style="font-size:16px"><b>是否确认结算选中数据？</b></span>
      <p style="margin-top:10px">
        结算后用户账户的映币将被扣除，并生成一则汇款明细！
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settleDg = false">取 消</el-button>
        <el-button type="primary" @click="settleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import env from "../../api/env";
import getUserInfo from "../../api/getUserInfo";
export default {
  data() {
    return {
      userInfo: getUserInfo(),
      time: "", //拼接当下年月
      checked: [], //选中的待结算记录
      list: [],
      settleDg: false,
      page_size: 10,
      page_id: 1,
      total: 0
    };
  },
  mounted() {
    this.getTime();
    this.queryList();
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  methods: {
    currentChange(current) {
      this.page_id = current;
      this.queryList();
    },
    getTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      this.time = year + month.toString();
    },
    async queryList() {
      let req = {
        page_id: this.page_id,
        page_size: this.page_size
      };
      let res = await this.$api.selectSettleList(req);
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    handleSelectionChange(val) {
      this.checked = val;
    },
    exportBtnClick(type) {
      //测试环境
      let BASEURL = `http://${env}.admin.test.collectivedynamic.com:30000`;
      //线上环境
      if (env == "online") {
        BASEURL = "https://admin-api.yingtu.co";
      }
      let user_id = this.userInfo.user_id || "";
      let sid = this.userInfo.sid || "";
      let req = {
        source: "web",
        sid: sid,
        user_id: user_id,
        data: {
          payment_method: type == 1 ? 1 : 2
        }
      };
      req = JSON.stringify(req);
      let str = encodeURI(req);
      window.location.href =
        BASEURL + `/admin/yun_settlement/v1/unsettled/export?data=${str}`;
    },
    goSettle() {
      if (this.checked.length == "") {
        this.$message.error("请先选择要结算的记录！");
        return false;
      }
      this.settleDg = true;
    },
    async settleConfirm() {
      //请求api
      let obj = {};
      obj.list = [...this.checked];
      let res = await this.$api.goSettle(obj);
      if (res.error_code == 0) {
        this.$message.success("结算成功！");
      }
      this.settleDg = false;
      this.queryList();
    }
  }
};
</script>
