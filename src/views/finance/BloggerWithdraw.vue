<template>
  <div>
    <p style="padding: 10px 0;font-weight: bold;">
      2020年6月17日之后新提现记录会展示在用户发薪，此页面数据保留到2021年6月30日
    </p>
    <div class="table-title">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            class="search-inp"
            v-model.trim="search.order_id"
            placeholder="订单Id"
            maxlength="19"
            @change="searchBtnClick"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            class="search-inp"
            v-model.trim="search.cp_nickname"
            placeholder="博主昵称"
            @change="searchBtnClick"
          />
        </el-form-item>
        <el-form-item label="提现状态">
          <el-select
            class="search-inp"
            v-model="search.status"
            @change="searchBtnClick"
          >
            <el-option :value="-1" label="全部"></el-option>
            <el-option :value="0" label="中间状态"></el-option>
            <el-option :value="1" label="提现成功"></el-option>
            <el-option :value="2" label="提现失败"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="订单ID"
        prop="order_id"
        width="200"
      ></el-table-column>
      <el-table-column
        label="提现博主"
        prop="cp_username"
        width="150"
      ></el-table-column>
      <el-table-column
        label="提现金额"
        prop="withdraw_money"
        width="110"
      ></el-table-column>
      <el-table-column
        label="提现账号"
        prop="withdraw_account_id"
        width="180"
      ></el-table-column>
      <el-table-column
        label="流水单号"
        prop="source_order_id"
        width="180"
      ></el-table-column>
      <el-table-column label="提现时间" min-width="140">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="170">
        <template slot-scope="scope">
          <p
            :class="{
              'txt-red': scope.row.status == 2,
              'txt-green': scope.row.status == 1
            }"
          >
            {{
              scope.row.status == 0
                ? "默认状态"
                : scope.row.status == 1
                ? "成功"
                : "失败"
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="page" v-if="search.total !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        layout="total, prev, pager, next, jumper"
        :total="search.total"
      ></el-pagination>
    </div>
    <!--分页 end-->

    <el-dialog title="详情" with="400px" :visible.sync="withdrawDialog">
      <table class="info-table">
        <tr>
          <td>订单ID:</td>
          <td>{{ currentWithdraw.order_id }}</td>
        </tr>
        <tr>
          <td>提现博主:</td>
          <td>{{ currentWithdraw.cp_username }}</td>
        </tr>
        <tr>
          <td>提现金额:</td>
          <td>{{ currentWithdraw.withdraw_money }}</td>
        </tr>
        <tr>
          <td>提现方式:</td>
          <td>支付宝</td>
        </tr>
        <tr>
          <td>提现时间:</td>
          <td>
            {{
              moment(currentWithdraw.create_time * 1000).format(
                "YYYY-MM-DD HH:mm"
              )
            }}
          </td>
        </tr>
        <tr>
          <td>提现账号:</td>
          <td>{{ currentWithdraw.withdraw_account_id }}</td>
        </tr>
        <tr>
          <td>流水单号:</td>
          <td>{{ currentWithdraw.source_order_id }}</td>
        </tr>
        <tr>
          <td>提现状态:</td>
          <td
            :class="{
              'txt-green': currentWithdraw.status == 1,
              'txt-red': currentWithdraw.status == 2
            }"
          >
            {{
              currentWithdraw.status == 1
                ? "成功"
                : currentWithdraw.status == 2
                ? "失败"
                : "默认状态"
            }}
          </td>
        </tr>
        <tr v-if="currentWithdraw.status == 2">
          <td>失败原因：</td>
          <td>{{ currentWithdraw.detail }}</td>
        </tr>
      </table>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      moment,
      list: [],
      withdrawDialog: false,
      search: {
        order_id: "", //  提案id
        cp_nickname: "", // 博主昵称
        status: -1, //-1： 全部， 0:默认状态, 1： 成功 2： 失败
        page_id: 1, //页码
        page_size: 10, // 一页显示条数
        total: 100
      },
      currentWithdraw: {} //详情单
    };
  },
  mounted() {
    this.searchBtnClick();
  },
  methods: {
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //获取博主信息列表
    async queryList() {
      if (!/\d+/.test(this.search.order_id) && this.search.order_id != "") {
        this.$message.error("订单ID为数字");
        return;
      }
      let res = await this.$api.getBbloggerWithdrawList(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.search.total = res.data.count; // -------总数
      } else {
        this.$message.error(res.data.error_description);
        this.list = [];
      }
    },
    showDetail(item) {
      this.currentWithdraw = item;
      this.withdrawDialog = true;
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
.action-box {
  margin: 20px 0;
}

.item_li {
  padding: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page {
  text-align: center;
  margin-top: 20px;
}

.info-table {
  border-top: 1px solid #ececec;
  border-left: 1px solid #ececec;
  width: 100%;
  margin-bottom: 20px;
}

.info-table td {
  border-bottom: 1px solid #ececec;
  border-right: 1px solid #ececec;
  padding: 5px;
}

.info-table tr td:first-child {
  width: 150px;
}
</style>
