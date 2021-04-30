<template>
  <div class="history-records">
    <el-form inline>
      <el-form-item>
        <el-button class="export-btn" type="primary" @click="$router.back()"
          >返回</el-button
        >
      </el-form-item>
      <el-form-item
        ><el-input
          placeholder="映兔ID"
          v-model.trim="search.cp_id"
          @keyup.enter.native="searchBtnClick"
        ></el-input
      ></el-form-item>
      <el-form-item
        ><el-input
          placeholder="映兔昵称"
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchBtnClick"
        ></el-input
      ></el-form-item>
      <el-form-item
        ><el-input
          placeholder="收款人姓名"
          v-model.trim="search.payee_name"
          @keyup.enter.native="searchBtnClick"
        ></el-input
      ></el-form-item>
      <el-form-item
        ><el-input
          placeholder="收款账号"
          v-model.trim="search.payee_account"
          @keyup.enter.native="searchBtnClick"
        ></el-input
      ></el-form-item>
      <el-form-item label="结算时间">
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          @change="searchBtnClick"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="export-btn" type="primary" @click="searchBtnClick"
          >搜索</el-button
        >
        <el-button @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button @click="exportBtnClick">全部导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="结算时间">
        <template slot-scope="scope">{{
          moment(scope.row.settled_time * 1000).format("YYYY-MM-DD HH:mm")
        }}</template>
      </el-table-column>
      <el-table-column label="映兔ID" prop="cp_id"></el-table-column>
      <el-table-column label="映兔昵称" prop="cp_nickname"></el-table-column>
      <el-table-column label="收款人｜收款账号">
        <template slot-scope="scope">
          <p v-if="scope.row.payee_name">{{ scope.row.payee_name }}</p>
          <p v-else>-</p>
          <p v-if="scope.row.payee_account">{{ scope.row.payee_account }}</p>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column label="结算金额">
        <template slot-scope="scope">
          <div>{{ toThousands(scope.row.point) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope"
          ><p>{{ allAdmin[scope.row.operator_id] }}</p></template
        >
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
import env from "../../api/env";
import getUserInfo from "../../api/getUserInfo";
export default {
  data() {
    return {
      userInfo: getUserInfo(),
      moment: moment,
      dateTime: [],
      list: [],
      total: 0,
      search: {
        cp_id: "",
        cp_nickname: "",
        payee_name: "",
        payee_account: "",
        start_time: "",
        end_time: "",
        page_id: 1,
        page_size: 10
      }
    };
  },
  watch: {
    dateTime(val) {
      if (!val) {
        this.search.start_time = 0;
        this.search.end_time = 0;
      } else {
        this.search.start_time = moment(val[0]).unix();
        this.search.end_time = moment(val[1]).unix();
      }
      this.searchBtnClick();
    }
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  mounted() {
    this.initSearchDate();
  },
  methods: {
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    },
    initSearchDate() {
      let nowDays = new Date();
      let year = nowDays.getFullYear();
      let month = nowDays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      let myDate = new Date(year, month, 0);
      let startDate = year + "-" + month + "-01 00:00:00"; //上个月第一天
      let endDate = year + "-" + month + "-" + myDate.getDate() + " 23:59:59"; //上个月最后一天
      this.dateTime = [startDate, endDate];
    },
    async queryList() {
      let res = await this.$api.historySettledRecords(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //重置
    reset() {
      this.dateTime = null;
      this.search = {
        cp_id: "",
        cp_nickname: "",
        payee_name: "",
        payee_account: "",
        page_id: 1,
        page_size: 10
      };
      this.queryList();
    },
    //导出
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
        user_id: user_id,
        data: {
          cp_id: this.search.cp_id,
          cp_nickname: this.search.cp_nickname,
          payee_name: this.search.payee_name,
          payee_account: this.search.payee_account,
          start_time: this.search.start_time,
          end_time: this.search.end_time
        }
      };
      if (this.search.cp_id == "") {
        delete req.data.cp_id;
      }
      req = JSON.stringify(req);
      let str = encodeURI(req);
      window.location.href =
        BASEURL + `/admin/yun_settlement/v1/record/export?data=${str}`;
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
