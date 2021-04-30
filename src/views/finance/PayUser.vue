<template>
  <!-- 用户发薪 -->
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          placeholder="映兔提现订单ID"
          v-model.trim="search.order_id"
          class="search-inp"
          maxlength="19"
          @keyup.native.enter="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="映兔用户昵称"
          v-model.trim="search.nickname"
          class="search-inp"
          @keyup.native.enter="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="流水单号"
          maxlength="19"
          v-model.trim="search.serial_num"
          class="search-inp"
          @keyup.native.enter="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item label="发薪状态:">
        <el-select
          v-model="search.status"
          class="search-inp"
          @change="searchBtnClick"
        >
          <el-option value label="全部"></el-option>
          <el-option value="SettleStatusWaiting" label="打款中"></el-option>
          <el-option value="SettleStatusSuccess" label="打款成功"></el-option>
          <el-option value="SettleStatusFail" label="打款失败"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请发薪时间">
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
        <el-button icon="el-icon-search" type="primary" @click="searchBtnClick"
          >搜索</el-button
        >
        <el-button type="primary" @click="exportClick">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="order_id" label="映兔提现订单ID"></el-table-column>
      <el-table-column prop="nickname" label="映兔用户昵称"></el-table-column>
      <el-table-column prop="money" label="发薪金额">
        <template slot-scope="scope">
          {{ scope.row.money / 100 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="serial_num"
        label="流水单号"
        width="180"
      ></el-table-column>
      <el-table-column prop="apply_time" label="申请发薪时间" width="140">
        <template slot-scope="scope">
          {{
            moment(scope.row.apply_time * 1000).format("YYYY/MM/DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status == 'SettleStatusSuccess'"
            type="success"
            >打款成功</el-tag
          >
          <el-tag v-if="scope.row.status == 'SettleStatusWaiting'"
            >打款中</el-tag
          >
          <el-tag v-if="scope.row.status == 'SettleStatusFail'" type="danger"
            >打款失败</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="detailClick(scope.row.order_id)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination" v-if="total > 0">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :current-page="search.page_id"
        :page-size="search.page_size"
        @current-change="handleChange"
      ></el-pagination>
    </div>

    <!-- 详情dialog -->
    <el-dialog title="订单详情" :visible.sync="detailDg">
      <table class="in-table">
        <tr>
          <td>映兔提现订单ID</td>
          <td>{{ order.order_id }}</td>
        </tr>
        <tr>
          <td>映兔用户昵称</td>
          <td>{{ order.nickname }}</td>
        </tr>
        <tr>
          <td>用户名称</td>
          <td>{{ order.name }}</td>
        </tr>
        <tr>
          <td>用户唯一标识</td>
          <td>{{ order.outer_user_id }}</td>
        </tr>
        <tr>
          <td>结算金额</td>
          <td>{{ order.settle_point / 100 }} 映币</td>
        </tr>
        <tr>
          <td>个税</td>
          <td>{{ order.personal_income_tax / 100 }} 元</td>
        </tr>
        <tr>
          <td>服务费</td>
          <td>{{ order.service_fee / 100 }} 元</td>
        </tr>
        <tr>
          <td>发薪金额</td>
          <td>{{ order.money / 100 }} 元</td>
        </tr>
        <tr>
          <td>发薪方式</td>
          <td>{{ order.type == "SettleTypeNianXin" ? "年薪" : "" }}</td>
        </tr>
        <tr>
          <td>申请发薪时间</td>
          <td>
            {{ moment(order.apply_time * 1000).format("YYYY/MM/DD HH:mm:ss") }}
          </td>
        </tr>
        <tr>
          <td>收款账号</td>
          <td>{{ order.account.name }} {{ order.account.number }}</td>
        </tr>
        <tr>
          <td>流水单号</td>
          <td>{{ order.serial_num }}</td>
        </tr>
        <tr>
          <td>发薪状态</td>
          <td v-if="order.status == 'SettleStatusFail'">打款失败</td>
          <td v-if="order.status == 'SettleStatusWaiting'">打款中</td>
          <td v-if="order.status == 'SettleStatusSuccess'">打款成功</td>
        </tr>
        <tr>
          <td>结算时间</td>
          <td>
            {{
              order.done_time == 1
                ? "-"
                : moment(order.done_time * 1000).format("YYYY/MM/DD HH:mm:ss")
            }}
          </td>
        </tr>
        <tr>
          <td>打款备注</td>
          <td>{{ order.remark }}</td>
        </tr>
      </table>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "PayUser", // 用户发薪
  data() {
    return {
      moment: moment,
      total: 100,
      detailDg: false, // 详情弹窗
      list: [], // 列表
      search: {
        order_id: "",
        nickname: "",
        status: "",
        start_time: "",
        end_time: "",
        page_id: 1,
        page_size: 10,
        serial_num: ""
      },
      dateTime: {},
      order: {
        account: {}
      } // 订单信息
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
    // this.initSearchDate();
    this.queryList();
  },
  methods: {
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async detailClick(order_id) {
      let res = await this.$api.cpWithdrawDetail({ order_id });
      if (res.error_code == 0) {
        this.order = res.data || {};
        this.detailDg = true;
      }
    },
    initSearchDate() {
      // 初始化默认展示30天数据
      let startDate = moment(
          new Date().valueOf() - 29 * 24 * 60 * 60 * 1000
        ).startOf("day"),
        endDate = moment().endOf("day");
      this.dateTime = [startDate, endDate];
    },
    // 查询列表
    async queryList() {
      let res = await this.$api.cpWithdrawList(this.$initReq(this.search));
      if (res.error_code == 0) {
        if (res.data) {
          this.list = res.data.list || [];
          this.total = res.data.count || 0;
        } else {
          this.list = [];
          this.total = 0;
        }
      }
    },
    handleChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    // 导出列表
    async exportClick() {
      let res = await this.$api.cpWithdrawExport(this.$initReq(this.search));
      if (res.error_code == 0) {
        location.href = res.data.download_url;
      }
    }
  }
};
</script>
