<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="客户id"
          maxlength="19"
          v-model.trim="search.sponsor_id"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="企业名称"
          v-model.trim="search.company"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <bd-select
          class="search-inp"
          v-model="search.admin_id"
          @change="searchBtnClick"
        ></bd-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="search.pool_type"
          class="search-inp"
          @change="searchBtnClick"
        >
          <el-option value label="客户池"></el-option>
          <el-option :value="1" label="个人私有池"></el-option>
          <el-option :value="2" label="个人发展池"></el-option>
          <el-option :value="3" label="公司公海"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.classification"
          @change="searchBtnClick"
        >
          <el-option value label="分类"></el-option>
          <el-option :value="1" label="充值"></el-option>
          <el-option :value="2" label="购买置换活动"></el-option>
          <el-option :value="3" label="退款"></el-option>
          <el-option :value="4" label="映币消耗置换"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="订单金额"
          v-model.trim="search.amount_start"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
        -
        <el-input
          class="search-inp"
          placeholder="订单金额"
          v-model.trim="search.amount_end"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item label="记录时间">
        <el-date-picker
          class="search-time"
          v-model="date"
          type="daterange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchBtnClick"
          >搜索</el-button
        >
        <el-button icon="el-icon-download" @click="exportClick">导出</el-button>
      </el-form-item>
    </el-form>

    <div class="header">
      <div class="item">
        <p class="title">充值</p>
        <p class="content">{{ header.recharge / 100 || "-" }}</p>
      </div>
      <div class="item">
        <p class="title">购买置换活动</p>
        <p class="content">{{ header.replace_campaign / 100 || "-" }}</p>
      </div>
      <div class="item">
        <p class="title">映币消耗置换</p>
        <p class="content">{{ header.point_replace_campaign / 100 || "-" }}</p>
      </div>
      <div class="item">
        <p class="title">充值退款</p>
        <p class="content">{{ header.refund / 100 || "-" }}</p>
      </div>
    </div>

    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="客户id" prop="sponsor_id"></el-table-column>
      <el-table-column label="企业名称" prop="company_name"></el-table-column>
      <el-table-column label="BD负责人" prop="admin_id">
        <template slot-scope="scope">
          {{ allAdmin[scope.row.admin_id] }}
        </template>
      </el-table-column>
      <el-table-column label="客户池" prop="pool_type">
        <template slot-scope="scope">
          {{ pools[scope.row.pool_type] }}
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="classification">
        <template slot-scope="scope">
          {{ classes[scope.row.classification] }}
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="amount">
        <template slot-scope="scope">
          {{ scope.row.amount / 100 }}
        </template>
      </el-table-column>
      <el-table-column label="记录时间" prop="record_time" width="150">
        <template slot-scope="scope">
          {{
            moment(scope.row.record_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination" v-if="total > search.page_size">
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
import { BASEURL } from "../../api/baseUrl";
import moment from "moment";
import BdSelect from "../../components/BdSelect";
export default {
  name: "BdKpi",
  components: {
    BdSelect
  },
  data() {
    return {
      total: 0,
      moment: moment,
      list: [],
      date: {},
      pools: ["", "个人私有池", "个人发展池", "公司公海"],
      classes: ["", "充值", "购买置换活动", "退款", "映币消耗置换"],
      search: {
        sponsor_id: "", // 客户id
        company: "", //公司名称
        admin_id: "", //BD
        pool_type: "", // 1:私有池 2:发展池 3:公海池
        classification: "", //分类:1:充值 2 购买置换活动 3 退款 4 映币消耗置换
        amount_start: "",
        amount_end: "",
        create_start: "", // 记录开始时间
        create_end: "", //记录结束时间
        page_id: 1,
        page_size: 10
      },
      header: {
        recharge: 0,
        replace_campaign: 0,
        refund: 0,
        point_replace_campaign: 0
      }
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  created() {
    this.date = this.getMonthBeginEnd();
  },
  watch: {
    date(val) {
      if (!val) {
        this.search.create_start = 0;
        this.search.create_end = 0;
      } else {
        this.search.create_start = moment(val[0]).unix();
        this.search.create_end = moment(val[1]).unix();
      }
      this.searchBtnClick();
    }
  },
  methods: {
    exportClick() {
      window.location.href =
        BASEURL +
        `/admin/finance/v1/export?sponsor_id=${this.search.sponsor_id ||
          ""}&company=${this.search.company || ""}&admin_id=${this.search
          .admin_id || ""}&pool_type=${this.search.pool_type ||
          ""}&classification=${this.search.classification ||
          ""}&amount_start=${this.search.amount_start || ""}&amount_end=${this
          .search.amount_end || ""}&record_start=${this.search.create_start ||
          ""}&record_end=${this.search.create_end || ""}`;
    },
    getMonthBeginEnd() {
      const result = { begin: 0, end: 0 };
      const target = new Date();
      let year = target.getFullYear(),
        month = target.getMonth();
      target.setFullYear(year);
      // 上个月
      // target.setMonth(month - 1);
      // 这个月
      target.setMonth(month);
      target.setDate(1);
      target.setHours(0);
      target.setMinutes(0);
      target.setSeconds(0);
      target.setMilliseconds(0);
      result.begin = target.getTime();

      // target.setMonth(month); //当月的下个月1日 0时0分0秒
      // target.setSeconds(-1); //前1秒,即昨天最后1秒钟,也就是上个月的最后一秒钟
      let today = new Date().getDate();
      result.end = new Date(year, month, today, "23", "59", "59");
      console.log(year, month, today);
      return [result.begin, result.end];
    },
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      let req = { ...this.$initReq(this.search) };
      req.amount_start &&
        // 精度丢失
        (req.amount_start = parseInt(Math.round(req.amount_start * 100)) + "");
      req.amount_end &&
        (req.amount_end = parseInt(Math.round(req.amount_end * 100)) + "");
      let res = await this.$api.getBdKpiList(req);
      if (res.error_code == 0) {
        this.header = {
          recharge: res.data.recharge,
          replace_campaign: res.data.replace_campaign,
          refund: res.data.refund,
          point_replace_campaign: res.data.point_replace_campaign
        };
        this.list = res.data.list || [];
        this.total = res.data.count || 0;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  .search-time {
    width: 250px;
  }
  .header {
    display: flex;
    padding: 20px;
    background: #fff;
    margin: 20px 0;
    .item {
      flex: 1;
      text-align: center;
      border-right: 1px solid #e3e3e3;
      &:last-child {
        border-right: none;
      }
      .title {
        font-size: 14px;
        color: #8d8d8d;
      }
      .content {
        font-size: 20px;
        font-weight: bold;
        padding: 4px 0;
      }
    }
  }
}
</style>
