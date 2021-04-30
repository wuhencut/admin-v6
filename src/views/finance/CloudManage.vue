<template>
  <div class="cloud-manage">
    <el-form inline>
      <el-form-item>
        <el-input
          placeholder="映兔ID"
          v-model.trim="search.cp_id"
          @keyup.enter.native="searchBtnClick"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="映兔昵称"
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="收款人姓名"
          v-model.trim="search.payee_name"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.collaborate_status" @change="searchBtnClick">
          <el-option label="合作状态" value></el-option>
          <el-option :value="1" label="进行中"></el-option>
          <el-option :value="2" label="已中止"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.yunzhanghu_status" @change="searchBtnClick">
          <el-option label="云账户状态" value></el-option>
          <el-option :value="1" label="待签约"></el-option>
          <el-option :value="2" label="进行中"></el-option>
          <el-option :value="3" label="已中止"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchBtnClick"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item style="float:right">
        <el-button @click="exportBtnClick">导出签约信息</el-button>
        <el-button @click="historyRecord">历史结算记录</el-button>
        <el-button class="export-btn" type="primary" @click="settledInfo"
          >进入结算页</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="list">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="映兔ID" prop="cp_id"> </el-table-column>
      <el-table-column label="映兔昵称" prop="cp_nickname"> </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope"
          ><p>{{ allAdmin[scope.row.operator_id] }}</p></template
        >
      </el-table-column>
      <el-table-column
        label="签约手机"
        prop="sign_phone_number"
      ></el-table-column>
      <el-table-column label="合作状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.collaborate_status == 1"
            >进行中</el-tag
          >
          <el-tag type="warning" v-if="scope.row.collaborate_status == 2"
            >已中止</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="收款人｜证件号">
        <template slot-scope="scope">
          <p>{{ scope.row.payee_name }}</p>
          <p>{{ scope.row.payee_id }}</p>
        </template>
      </el-table-column>
      <el-table-column label="云账户状态" prop="yunzhanghu_status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.yunzhanghu_status == 1">待签约</el-tag>
          <el-tag type="success" v-if="scope.row.yunzhanghu_status == 2"
            >进行中</el-tag
          >
          <el-tag type="warning" v-if="scope.row.yunzhanghu_status == 3"
            >已中止</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="上次结算金额" min-width="130px">
        <template slot-scope="scope">
          <p v-if="scope.row.Last_settled_point">
            {{
              moment(scope.row.Last_settled_time * 1000).format("YYYY-MM-DD")
            }}：{{ toThousands(scope.row.Last_settled_point) }}
          </p>
          <p v-else>--</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100px">
        <template slot-scope="scope">
          <settle-detail :settleMessage="scope.row"></settle-detail>
          <el-button
            type="text"
            v-if="
              scope.row.collaborate_status == 1 &&
                scope.row.yunzhanghu_status == 1
            "
            @click="signingFinish(scope.row.cp_id)"
            >签约完成</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.yunzhanghu_status == 3"
            @click="openCloud(scope.row.cp_id)"
            >开启云账户</el-button
          >
          <el-button
            type="text"
            v-if="
              scope.row.collaborate_status == 2 &&
                scope.row.yunzhanghu_status == 2
            "
            @click="closeCloud(scope.row.cp_id)"
            >关闭云账户</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-show="list.length">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        :current-page="search.page_id"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import SettleDetail from "../finance/components/SettleDetail";
import env from "../../api/env";
import getUserInfo from "../../api/getUserInfo";
export default {
  name: "cloudManage",
  components: {
    SettleDetail
  },
  data() {
    return {
      userInfo: getUserInfo(),
      moment: moment,
      total: 0,
      search: {
        cp_id: "",
        cp_nickname: "",
        payee_name: "",
        collaborate_status: "", //合作状态  1 待签约 2 进行中 3 已中止,
        yunzhanghu_status: "", // 1 待签约 2 进行中 3 已中止,
        page_id: 1,
        page_size: 10
      },
      list: []
    };
  },
  mounted() {
    this.queryList();
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  methods: {
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      let res = await this.$api.getSignedBloggerList(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    //历史结算记录
    historyRecord() {
      this.$router.push({
        name: "historyRecords"
      });
    },
    exportBtnClick() {
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
        user_id: user_id
      };
      req = JSON.stringify(req);
      let str = encodeURI(req);
      window.location.href =
        BASEURL + `/admin/yun_settlement/v1/export_unsigned?data=${str}`;
    },
    //结算页
    settledInfo() {
      this.$router.push({
        name: "settledInfo"
      });
    },
    //签约完成
    signingFinish(id) {
      this.changeID = id;
      this.status = 2;
      this.$confirm("是否确定完成云账户签约？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      }).then(async () => {
        await this.cloudChange();
      });
    },
    openCloud(id) {
      this.changeID = id;
      this.status = 2;
      this.$confirm("是否重新开启云账户状态？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(async () => {
        await this.cloudChange();
      });
    },
    //关闭云账户
    closeCloud(id) {
      this.changeID = id;
      this.status = 3;
      this.$confirm("是否确认关闭云账户状态？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(async () => {
        await this.cloudChange();
      });
    },
    //更改云账户状态
    async cloudChange() {
      let req = {
        cp_id: this.changeID,
        yunzhanghu_status: this.status
      };
      let res = await this.$api.changeCloudAccountStatus(req);
      if (res.error_code == 0) {
        this.$message.success("操作成功");
      }
      this.searchBtnClick();
    },
    //数字千位符格式化
    toThousands(num) {
      num = (num || 0).toString();
      let result = "", //最重结果
        decimal = "", // 小数部分
        index = num.indexOf("."); //小数点的index
      if (index !== -1) {
        decimal = num.substr(index).toString(); // 取出小数部分
        num = num.substr(0, index); // 取出整数数部分
      }
      while (num.length > 3) {
        result = "," + num.slice(-3) + result; //取出最后的三位正数加 ","
        num = num.slice(0, num.length - 3); // 取出剩余的整数，再重复
      }
      if (num) result = num + result + decimal; // 如果最后num还剩余整数，说明，num % 3 ！= 0 。
      return result;
    }
  }
};
</script>
