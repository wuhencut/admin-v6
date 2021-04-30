<template>
  <div class="bamanage-list">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="映兔昵称"
          v-model.trim="search.nickname"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="映兔ID"
          maxlength="19"
          v-model.trim="search.ba_id"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="手机号"
          v-model.trim="search.phone"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="微信号"
          v-model.trim="search.wx"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item label="分享时间">
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeDate"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtnClick" type="primary" icon="el-icon-search"
          >搜索</el-button
        >
        <el-button @click="refreshBtnClick" icon="el-icon-refresh"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="映兔昵称" prop="nickname"></el-table-column>
      <el-table-column label="映兔ID" prop="ba_id"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="微信号" prop="wx"></el-table-column>
      <el-table-column label="分享商品名称" prop="production_name">
      </el-table-column>
      <el-table-column
        label="点击量-小程序"
        prop="weapp_click_num"
      ></el-table-column>
      <el-table-column
        label="点击量-映口令"
        prop="code_click_num"
      ></el-table-column>
      <el-table-column
        label="转化数-小程序"
        prop="weapp_conversion_num"
      ></el-table-column>
      <el-table-column
        label="转化数-映口令"
        prop="code_conversion_num"
      ></el-table-column>
      <el-table-column label="分享时间">
        <template slot-scope="scope">
          <p>
            {{ moment(scope.row.share_time * 1000).format("YYYY-MM-DD HH:mm") }}
          </p>
        </template></el-table-column
      >
    </el-table>
    <!--page-->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        layout="total,prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page_id"
        :page-size="10"
        :total="count"
      ></el-pagination>
    </div>
    <!--/page-->
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      moment: moment,
      date: null,
      count: 0,
      list: [],
      search: {
        ba_id: "",
        nickname: "",
        page_id: 1,
        page_size: 10,
        phone: "",
        wx: "",
        start_time: "",
        end_time: ""
      }
    };
  },
  mounted() {
    this.queryList();
  },
  methods: {
    //切换日期
    changeDate(date) {
      if (date !== null) {
        this.search.start_time = moment(date[0] + " 00:00:00").unix();
        this.search.end_time = moment(date[1] + " 23:59:59").unix();
      } else {
        this.search.start_time = 0;
        this.search.end_time = 0;
      }
      this.searchBtnClick();
    },
    //获取分享人员列表
    async queryList() {
      let res = await this.$api.getShareList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
      }
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    refreshBtnClick() {
      this.search = {
        ba_id: "",
        nickname: "",
        page_id: 1,
        page_size: 10,
        phone: "",
        wx: "",
        start_time: "",
        end_time: ""
      };
      this.searchBtnClick();
    }
  }
};
</script>

<style lang="less" scoped></style>
