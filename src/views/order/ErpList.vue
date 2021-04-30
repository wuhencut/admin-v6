<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          placeholder="企业名称"
          v-model.trim="search.company_name"
          class="search-inp"
          @keyup.native.enter="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="第三方服务商名称"
          v-model.trim="search.third_server"
          class="search-inp"
          @keyup.native.enter="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="授权状态"></el-option>
          <el-option :value="0" label="已解除"></el-option>
          <el-option :value="1" label="已授权"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间:">
        <el-date-picker
          class="search-time"
          v-model="dateTime"
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
      </el-form-item>
    </el-form>

    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="企业名称" prop="company_name"></el-table-column>
      <el-table-column label="申请时间" prop="apply_time">
        <template slot-scope="scope">
          {{ moment(scope.row.apply_time).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="授权目的" prop="erp_reason"></el-table-column>
      <el-table-column
        label="第三方服务商名称"
        prop="third_server"
      ></el-table-column>
      <el-table-column label="授权状态" prop="status">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 1">已授权</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 0">已解除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="checkClick(scope.row.erp_info)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination" v-if="total > 0">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        :page-size="search.page_size"
        :current-page="search.page_id"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :visible.sync="showDg" title="授权记录">
      <div class="item">
        <p>app_id: {{ erp_info.app_id }}</p>
        <!-- <p>app_key: {{erp_info.app_key}}</p> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "ErpList",
  data() {
    return {
      showDg: false, // 查看
      erp_info: [], // 授权记录
      total: 0,
      list: [],
      moment: moment,
      dateTime: {},
      search: {
        company_name: "",
        third_server: "",
        status: -1,
        start_time: "",
        end_time: "",
        page_id: 1,
        page_size: 10
      }
    };
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
  created() {
    this.queryList();
  },
  methods: {
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      let res = await this.$api.getErpList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count || 0;
      } else {
        this.$message.error(res.error_desription);
      }
    },
    checkClick(info) {
      this.erp_info = info;
      this.showDg = true;
    }
  }
};
</script>
