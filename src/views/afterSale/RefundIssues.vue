<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.order_id"
          placeholder="请输入订单编号"
          maxlength="19"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.ticket_id"
          placeholder="请输入退款编号"
          maxlength="19"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.brand_name"
          placeholder="请输入品牌名称"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请时间:">
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="queryList"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="refreshBtnClick"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="订单编号"
        prop="order_id"
        width="160"
      ></el-table-column>
      <el-table-column
        label="退款编号"
        prop="ticket_id"
        width="80"
      ></el-table-column>
      <el-table-column label="退款方式" width="100" prop="ticket_type">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="production_name"
        min-width="200"
      ></el-table-column>
      <el-table-column label="发货状态" prop="deliver_status" width="120">
      </el-table-column>
      <el-table-column
        label="公司名称"
        prop="company_name"
        width="130"
      ></el-table-column>
      <el-table-column
        label="品牌名称"
        prop="brand_name"
        min-width="150"
      ></el-table-column>
      <el-table-column label="申请日期">
        <template slot-scope="scope">{{
          moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
        }}</template>
      </el-table-column>
      <el-table-column label="退款状态" prop="refund_status"> </el-table-column>
    </el-table>

    <div class="pagination" v-show="list.length">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        :page-size="search.page_size"
        :current-page="search.page_id"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "RefundIssues",
  data() {
    return {
      moment: moment,
      search: {
        ticket_id: "",
        order_id: "",
        brand_name: "",
        page_id: 1,
        page_size: 10
      },
      dateTime: {},
      list: [],
      total: 100
    };
  },
  mounted() {
    this.queryList();
  },
  watch: {
    dateTime(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.start_time = 0;
        this.search.end_time = 0;
      } else {
        this.search.start_time = moment(val[0]).unix();
        this.search.end_time = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    }
  },
  methods: {
    refreshBtnClick() {
      this.search = {
        ticket_id: "",
        order_id: "",
        brand_name: "",
        page_id: 1,
        page_size: 10
      };
      this.dateTime = {};
      this.queryList();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      let res = await this.$api.getRefoundList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    }
  }
};
</script>
