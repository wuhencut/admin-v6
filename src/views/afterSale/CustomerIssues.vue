<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="ticket_id"
          placeholder="请输入问题编号"
          @keyup.enter.native="searchBtnClick"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="order_id"
          placeholder="请输入订单编号"
          maxlength="19"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.order_type"
          @change="searchBtnClick"
          placeholder="请选择订单类型"
        >
          <el-option label="全部订单类型" value="all"></el-option>
          <el-option label="星选商城" value="Star"></el-option>
          <el-option label="私享体验" value="NORMALCAMPAIGN"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.ticket_type"
          @change="searchBtnClick"
          placeholder="请选择问题类型"
        >
          <el-option label="所有问题类型" value="AllCustomerType"></el-option>
          <el-option label="博主物流催发货" value="Notify"></el-option>
          <el-option label="粉丝物流催发货" value="FansNotify"></el-option>
          <el-option label="修改收货信息" value="Address"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.ticket_status"
          @change="searchBtnClick"
          placeholder="请选择问题状态"
        >
          <el-option label="所有问题状态" value="AllCustomerStatus"></el-option>
          <el-option label="待解决" value="Waiting"></el-option>
          <el-option label="已完结" value="Finished"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.brand_name"
          placeholder="请输入品牌名称"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item
        ><el-input
          v-model.trim="search.cp_nickname"
          class="search-inp"
          placeholder="请输入用户昵称"
          @keyup.enter.native="searchBtnClick"
        ></el-input
      ></el-form-item>
      <el-form-item label="创建时间:">
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
        label="问题编号"
        prop="ticket_id"
        width="120"
      ></el-table-column>
      <el-table-column label="订单类型" width="120">
        <template slot-scope="scope">
          <p v-if="scope.row.order_type == 'Star'">星选商城</p>
          <p v-if="scope.row.order_type == 'NORMALCAMPAIGN'">私享体验</p>
        </template>
      </el-table-column>
      <el-table-column
        label="用户昵称"
        prop="cp_nickname"
        width="100"
      ></el-table-column>
      <el-table-column label="公司 | 品牌" width="190">
        <template slot-scope="scope">
          <p>{{ scope.row.company_name || "-" }}</p>
          <p>{{ scope.row.brand_name || "-" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="订单编号 | 用户昵称" prop="order_id" width="200">
        <template slot-scope="scope">
          <p>{{ scope.row.order_id || "-" }}</p>
          <p>{{ scope.row.cp_nickname || "-" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="问题类型" prop="ticket_type" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.ticket_type == 'Notify'">博主物流催发货</span>
          <span v-if="scope.row.ticket_type == 'FansNotify'"
            >粉丝物流催发货</span
          >
          <span v-if="scope.row.ticket_type == 'Address'">修改收货信息</span>
        </template>
      </el-table-column>
      <el-table-column label="问题状态" prop="ticket_status">
        <template slot-scope="scope">
          <span v-if="scope.row.ticket_status == 'Waiting'">待解决</span>
          <span v-if="scope.row.ticket_status == 'Finished'">已完结</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="130px">
        <template slot-scope="scope">{{
          moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.order_type == 'NORMALCAMPAIGN'"
            type="text"
            @click="detailClick(scope.row.order_id)"
            >订单详情</el-button
          >
          <el-button type="text" @click="recordClick(scope.row)"
            >协商记录</el-button
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
        :page-size="search.page_size"
        :current-page="search.page_id"
      ></el-pagination>
    </div>

    <!-- 详情dg -->
    <el-dialog title="订单详情" :visible.sync="showDetailDg" width="800px">
      <!-- 订单详情 -->
      <order-detail :order="order"></order-detail>
      <p style="padding: 10px 0; font-size: 18px; font-weight: bold;">
        订单变更记录
      </p>
      <el-table :data="changeRecords">
        <el-table-column label="时间">
          <template slot-scope="scope">
            <p>
              {{
                moment(scope.row.change_time * 1000).format("YYYY-MM-DD HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="备注" prop="content"></el-table-column>
        <el-table-column label="操作人" prop="operator_name"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 详情dg -->

    <!-- 协商记录弹窗 -->
    <el-dialog
      :visible.sync="showRecordDg"
      :title="'订单' + currOrderId + '协商记录'"
      width="800px"
    >
      <message
        v-if="showRecordDg"
        :id="currOrderId"
        @closeDg="showRecordDg = false"
        :msgDisabled="
          orderStatus == 'Finished' || authList.indexOf('id131') < 0
        "
      ></message>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import Message from "../../components/Message";
import OrderDetail from "../../components/OrderDetail";
export default {
  name: "CustomerIssues", // 客户问题
  components: {
    Message,
    OrderDetail
  },
  data() {
    return {
      orderStatus: "",
      msgDisabled: false, // 禁用输入 message 组件
      reviewsType: ["不限形式", "视频", "图文"], //评测形式
      currOrderId: "", // 当前工单id
      showDetailDg: false, // 详情弹窗
      showRecordDg: false, // 协商弹窗
      moment: moment,
      ticket_id: "",
      order_id: "",
      search: {
        page_id: 1,
        page_size: 10,
        order_type: "all",
        brand_name: "",
        ticket_type: "AllCustomerType",
        ticket_status: "AllCustomerStatus",
        cp_nickname: "" // 用户昵称
      },
      total: 0,
      dateTime: {},
      list: [],
      order: {
        quote_info: {},
        reward: {
          type: 1,
          form: {},
          rank: {}
        }
      }, // 订单详情
      changeRecords: [] // 订单变更记录
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  mounted() {
    this.queryList();
  },
  watch: {
    order_id(val) {
      this.search.order_id = val;
      if (!val) {
        delete this.search.order_id;
      }
    },
    ticket_id(val) {
      this.search.ticket_id = val;
      if (!val) {
        delete this.search.ticket_id;
      }
    },
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
    // 获取订单变更记录
    async getChangeRecord(order_id) {
      let res = await this.$api.orderHistoty({ order_id: order_id });
      if (res.error_code == 0) {
        this.changeRecords = res.data || [];
      } else {
        this.changeRecords = null;
      }
    },
    // 查看沟通记录
    async recordClick(data) {
      this.currOrderId = data.order_id || "";
      this.orderStatus = data.ticket_status || "";
      this.showRecordDg = true;
    },
    // 获取详情
    async getDetail(id) {
      let res = await this.$api.orderDetail({ order_id: id });
      if (res.error_code == 0) {
        this.order = res.data || {};
      } else {
        this.order = null;
      }
    },
    // 详情点击
    async detailClick(order_id) {
      await this.getChangeRecord(order_id);
      await this.getDetail(order_id);
      if (this.order && this.changeRecords) {
        this.showDetailDg = true;
      }
    },
    // 点击重置
    refreshBtnClick() {
      this.search = {
        page_id: 1,
        page_size: 20,
        order_type: "all",
        brand_name: "",
        ticket_type: "AllCustomerType",
        ticket_status: "AllCustomerStatus",
        cp_nickname: "" // 用户昵称
      };
      this.queryList();
    },
    // 点击搜索
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    },
    // 查询列表
    async queryList() {
      let res = await this.$api.getCustomerIssues(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data ? res.data.list : [];
        this.total = res.data ? res.data.count : 0;
      }
    }
  }
};
</script>
<style lang="less"></style>
