<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          v-model.trim="search.order_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="测评订单号"
          maxlength="19"
          class="search-inp"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="search.ensure_ticket_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="罚款单号"
          maxlength="19"
          class="search-inp"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="search.trade_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="支付单号"
          class="search-inp"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchBtnClick"
          placeholder="博主昵称"
          class="search-inp"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="search.campaign_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动名称"
          class="search-inp"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.type"
          @change="searchBtnClick"
        >
          <el-option label="全部罚款类型" value="全部"></el-option>
          <el-option label="重评罚款" value="重评罚款"></el-option>
          <el-option label="逾期罚款" value="逾期罚款"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option label="全部罚款状态" value="全部"></el-option>
          <el-option label="待结算" value="待结算"></el-option>
          <el-option label="待支付" value="待支付"></el-option>
          <el-option label="支付成功" value="支付成功"></el-option>
          <el-option label="已关闭" value="已关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="罚款产生时间:">
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
        <el-button @click="searchBtnClick" icon="el-icon-search"
          >搜索</el-button
        >
        <el-button
          v-if="authList.indexOf('id121') > -1"
          @click="exportBtnClick"
          icon="el-icon-download"
          >导出表格</el-button
        >
      </el-form-item>
    </el-form>

    <!-- list -->
    <el-table :data="list">
      <el-table-column
        label="订单号 | 罚款单号 | 支付单号"
        prop="order_id"
        width="200"
      >
        <template slot-scope="scope">
          <p>订单号: {{ scope.row.order_id }}</p>
          <p>罚款单号: {{ scope.row.ensure_ticket_id }}</p>
          <p>支付单号: {{ scope.row.trade_id || "-" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="博主昵称" prop="cp_nickname"></el-table-column>
      <el-table-column
        label="活动名称"
        prop="campaign_name"
        width="150"
      ></el-table-column>
      <el-table-column label="罚款类型" prop="type"></el-table-column>
      <el-table-column label="罚款状态" prop="status"></el-table-column>
      <el-table-column label="剩余时间" prop="time_remain" width="110">
        <template slot-scope="scope">
          {{ getDays(scope.row.time_remain) }}
        </template>
      </el-table-column>
      <el-table-column label="逾期天数" prop="over_days">
        <template slot-scope="scope">
          {{ scope.row.over_days + "天" || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="金额" width="120">
        <template slot-scope="scope">
          <p>罚款金额: {{ scope.row.total_amount }}</p>
          <p>已付金额: {{ scope.row.payed_amount }}</p>
          <p>剩余金额: {{ scope.row.rest_amount }}</p>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" max-width="100">
        <template slot-scope="scope">
          <div
            style="max-height: 90px; text-overflow: ellipsis; overflow: hidden;"
          >
            {{ scope.row.remark }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发生时间" prop="payed_amount" width="150">
        <template slot-scope="scope">
          {{
            moment(scope.row.create_time * 1000).format("YYYY/MM/DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button @click="detailClick(scope.row)" type="text"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-show="total > 0">
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
      <!-- 订单详情组件 -->
      <order-detail :order="order"></order-detail>
      <p style="padding: 10px 0; font-size: 18px; font-weight: bold;">
        罚款详情
        <el-button
          v-if="currIssue.status != '已关闭' && authList.indexOf('id120') > -1"
          type="danger"
          @click="closeClick"
          >关闭罚单</el-button
        >
      </p>
      <table class="in-table">
        <tbody>
          <tr>
            <td>罚款单号</td>
            <td>{{ currIssue.ensure_ticket_id }}</td>
            <td>罚款类型</td>
            <td>{{ currIssue.type }}</td>
          </tr>
          <tr>
            <td>开始时间</td>
            <td>
              {{
                moment(currIssue.create_time * 1000).format(
                  "YYYY/MM/DD HH:mm:ss"
                )
              }}
            </td>
            <td>结算时间</td>
            <td>
              {{
                currIssue.settle_time
                  ? moment(currIssue.settle_time * 1000).format(
                      "YYYY/MM/DD HH:mm:ss"
                    )
                  : "-"
              }}
            </td>
          </tr>
          <tr>
            <td>逾期天数</td>
            <td>{{ currIssue.over_days }}天</td>
            <td>罚款金额</td>
            <td>{{ currIssue.total_amount }}</td>
          </tr>
          <tr>
            <td>罚款状态</td>
            <td>{{ currIssue.status }}</td>
            <td>剩余时间</td>
            <td>{{ getDays(currIssue.time_remain) }}</td>
          </tr>
          <tr>
            <td>备注</td>
            <td style="width: 300px;">{{ currIssue.remark }}</td>
          </tr>
        </tbody>
      </table>
      <p style="padding: 10px 0; font-size: 18px; font-weight: bold;">
        罚款支付明细
      </p>
      <el-table :data="fineDetailList">
        <el-table-column label="支付时间">
          <template slot-scope="scope">
            <p>
              {{ moment(scope.row.pay_time * 1000).format("YYYY-MM-DD HH:mm") }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="pay_type"></el-table-column>
        <el-table-column label="支付单号" prop="trade_id"></el-table-column>
        <el-table-column label="支付金额" prop="amount"></el-table-column>
        <el-table-column label="扣款状态" prop="status"></el-table-column>
        <el-table-column label="芝麻信用" prop="auth_status"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.status == '退款失败'"
              @click="refoundClick(scope.row.trade_id)"
              >线下退款</el-button
            >
            <div v-if="scope.row.remark != '退款失败'">
              备注：{{ scope.row.remark }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 详情dg -->

    <!-- 关闭罚单 dg -->
    <el-dialog title="关闭罚款" :visible.sync="showCloseDg">
      <p style="padding-bottom: 10px;">
        提示:
        关闭罚款前，请先到「工具管理-加减信用」消除该条的信用记录关闭罚款后，
        若已支付的罚款将原路退回，并减去支付完成所加信用分
      </p>
      <el-input
        show-word-limit
        maxlength="200"
        type="textarea"
        :rows="3"
        placeholder="请输入关闭罚单的原因"
        v-model="closeFineData.remark"
      ></el-input>
      <div slot="footer">
        <el-button @click="showCloseDg = false">取消</el-button>
        <el-button @click="confirmClose" type="primary">确定</el-button>
      </div>
    </el-dialog>

    <!-- 退款 dg -->
    <el-dialog title="线下退款" :visible.sync="showRefoundDg">
      <p style="padding-bottom: 10px;">
        提示：若退款失败，请财务线下执行退款后，登记退款备注并自动变更扣款状态为「退款成功」
      </p>
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入退款理由"
        v-model="refoundData.remark"
      ></el-input>
      <div slot="footer">
        <el-button @click="showRefoundDg = false">取消</el-button>
        <el-button @click="confirmRefound" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import OrderDetail from "../../components/OrderDetail";
export default {
  name: "guaranteeFines",
  components: {
    OrderDetail
  },
  data() {
    return {
      reviewsType: ["不限形式", "视频", "图文"], //评测形式
      showCloseDg: false, // 关闭罚单
      moment: moment,
      dateTime: {},
      list: [],
      total: 0,
      currIssue: {},
      currTicketId: "",
      closeFineData: {
        ensure_ticket_id: "",
        remark: ""
      },
      search: {
        page_id: 1,
        page_size: 10,
        ensure_ticket_id: "", // 发单编号
        order_id: "",
        trade_id: "",
        cp_nickname: "",
        campaign_name: "",
        type: "全部",
        status: "全部",
        start_time: "",
        end_time: ""
      },
      order: {
        quote_info: {},
        reward: {
          type: 1,
          form: {},
          rank: {}
        }
      }, // 订单详情
      fineDetailList: [], // 罚单明细
      showDetailDg: false,
      showRefoundDg: false, // 退款弹窗
      refoundData: {
        remark: "",
        ensure_bill_id: "" // 支付单编号
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
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
  mounted() {
    this.initSearchDate();
    this.queryList();
  },
  methods: {
    initSearchDate() {
      // 初始化默认展示7天数据
      let startDate = moment(
          new Date().valueOf() - 6 * 24 * 60 * 60 * 1000
        ).startOf("day"),
        endDate = moment().endOf("day");
      this.dateTime = [startDate, endDate];
    },
    // 计算剩余时间
    getDays(sec) {
      let minute = 60,
        hour = 60 * 60,
        day = 24 * hour;
      let leftDay, leftHour, leftMinute; // 剩余天数，小数, 分
      if (sec > day) {
        leftDay = parseInt(sec / day);
        leftHour = parseInt((sec - leftDay * day) / hour);
        leftMinute = parseInt((sec - leftDay * day - leftHour * hour) / minute);
        return leftDay + "天" + leftHour + "小时" + leftMinute + "分";
      } else if (sec > 0 && sec < day) {
        leftHour = parseInt(sec / hour);
        leftMinute = parseInt((sec - leftHour * hour) / minute);
        return leftHour + "小时" + leftMinute + "分";
      } else if (sec > 0 && sec < hour) {
        leftMinute = parseInt(sec / minute);
        return leftMinute + "分";
      } else {
        return "-";
      }
    },
    async confirmRefound() {
      if (!this.refoundData.remark) {
        this.$message.error("请输入理由");
        return false;
      }
      let res = await this.$api.confirmRefound(this.refoundData);
      if (res.error_code == 0) {
        this.showRefoundDg = false;
        this.getFinesList(
          this.currIssue.ensure_ticket_id,
          this.currIssue.cp_id
        );
      }
    },
    // 退款弹窗
    refoundClick(id) {
      this.refoundData = {
        remark: "",
        ensure_bill_id: id //	支付单编号
      };
      this.showRefoundDg = true;
    },
    // 确认关闭罚单
    async confirmClose() {
      if (!this.closeFineData.remark) {
        this.$message.error("请输入关闭罚单的理由");
        return false;
      }
      let res = await this.$api.closeFine(this.closeFineData);
      if (res.error_code == 0) {
        this.queryList();
        this.showCloseDg = false;
        this.showDetailDg = false;
        this.$message.success("关闭成功");
      }
    },
    // 关闭罚单弹窗
    closeClick() {
      this.closeFineData = {
        ensure_ticket_id: this.currIssue.ensure_ticket_id,
        remark: ""
      };
      this.showCloseDg = true;
    },
    async queryList() {
      if (!this.search.start_time && !this.search.end_time) {
        return false;
      }
      let req = this.$initReq(this.search);
      let res = await this.$api.finesList(req);
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count || 0;
      }
    },
    async searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async detailClick(data) {
      this.currIssue = data; // 当前工单列表单条内容
      this.getDetail(data.order_id);
      this.getFinesList(data.ensure_ticket_id, data.cp_id);
      this.currIssue = data;
      if (this.order && this.fineDetailList) {
        this.showDetailDg = true;
      }
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
    // 罚单明细
    async getFinesList(ticket_id, user_id) {
      let res = await this.$api.getFineDetail({
        ensure_ticket_id: ticket_id,
        cp_id: user_id
      });
      if (res.error_code == 0) {
        this.fineDetailList = res.data.list || [];
      } else {
        this.fineDetailList = null;
      }
    },
    async exportBtnClick() {
      let res = await this.$api.exportGuaranteeFines(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        location.href = res.data.file_link;
        this.$message.success("导出成功");
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
