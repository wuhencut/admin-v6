<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.ticket_id"
          placeholder="请输入问题编号"
          maxlength="19"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
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
          v-model.trim="search.brand_name"
          placeholder="请输入品牌名称"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="请输入博主昵称"
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-select
        class="search-inp"
        v-model="search.status"
        @change="searchBtnClick"
      >
        <el-option value="全部" label="全部"></el-option>
        <el-option value="待修改" label="待修改"></el-option>
        <el-option value="待确认" label="待确认"></el-option>
        <el-option value="待审核" label="待审核"></el-option>
        <el-option value="已修改" label="已修改"></el-option>
        <el-option value="待重评" label="待重评"></el-option>
        <el-option value="已完结" label="已完结"></el-option>
      </el-select>
      <el-form-item label=" 创建时间:">
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
      <el-table-column label="问题编号" prop="ticket_id"></el-table-column>
      <el-table-column label="公司 | 品牌" width="150">
        <template slot-scope="scope">
          <p>{{ scope.row.company_name }}</p>
          <p>{{ scope.row.brand_name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="投诉渠道" width="150">
        <template slot-scope="scope">
          <el-link
            target="_blank"
            type="primary"
            :href="item.url"
            v-for="(item, index) in scope.row.ticket_appraisal"
            :key="index"
            >{{ item.channel ? $getPlatformName(item.channel) : ""
            }}<i v-if="index < scope.row.ticket_appraisal.length - 1"
              >、</i
            ></el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="测评问题" width="200">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.violation_reason" :key="index">
            <span>{{ index + 1 }}、</span>
            {{ item }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="已修改测评" width="150">
        <template slot-scope="scope">
          <el-link
            type="primary"
            target="_blank"
            :href="item.url"
            v-for="(item, index) in scope.row.modify_appraisal"
            :key="index"
            >{{ item.channel ? $getPlatformName(item.channel) : ""
            }}<i v-if="index < scope.row.modify_appraisal.length - 1"
              >、</i
            ></el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="订单编号 | 用户昵称" prop="order_id" width="150">
        <template slot-scope="scope">
          <p>{{ scope.row.order_id || "-" }}</p>
          <p>{{ scope.row.cp_nickname || "-" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="创建时间" width="140">
        <template slot-scope="scope">{{
          moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
        }}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="130">
        <template slot-scope="scope">
          <div
            v-if="
              scope.row.status == '待审核' && authList.indexOf('id117') > -1
            "
          >
            <el-button type="text" @click="auditReview(scope.row, 1)"
              >通过</el-button
            >
            <el-button type="text" @click="auditReview(scope.row, 0)"
              >拒绝</el-button
            >
          </div>
          <div>
            <el-button
              type="text"
              v-if="authList.indexOf('id118') > -1"
              @click="detailClick(scope.row.order_id, scope.row.order_type)"
              >订单详情</el-button
            >
            <el-button
              type="text"
              @click="recordClick(scope.row.order_id, scope.row.status)"
              >协商记录</el-button
            >
          </div>
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
        :page-size="search.page_size"
      ></el-pagination>
    </div>

    <!-- 投诉理由dg -->
    <el-dialog :visible.sync="reasonDg" title="投诉理由" width="600px">
      <el-checkbox-group :min="1" v-model="reasonChecked" :max="3">
        <p
          style="line-height: 3;"
          v-for="(item, index) in violationReasons"
          :key="index"
        >
          <el-checkbox :key="index" :label="item"></el-checkbox>
        </p>
      </el-checkbox-group>
      <div slot="footer">
        <el-button @click="reasonDg = false">取消</el-button>
        <el-button
          type="primary"
          @click="checkClick(1)"
          :disabled="reasonChecked.length == 0"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <!-- 定制订单 -->
    <el-dialog :visible.sync="cusReasonDg" title="投诉理由" width="600px">
      <el-checkbox-group :min="1" v-model="cusReasonChecked" :max="2">
        <p
          style="line-height: 3;"
          v-for="(item, index) in cusViolationReasons"
          :key="index"
        >
          <el-checkbox :key="index" :label="item"></el-checkbox>
        </p>
      </el-checkbox-group>
      <div slot="footer">
        <el-button @click="cusReasonDg = false">取消</el-button>
        <el-button
          type="primary"
          @click="checkClick(1)"
          :disabled="cusReasonChecked.length == 0"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <!-- 详情dg -->
    <el-dialog title="订单详情" :visible.sync="showDetailDg">
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
        <el-table-column label="状态" prop="status"> </el-table-column>
        <el-table-column label="备注" prop="content"></el-table-column>
        <el-table-column label="操作人" prop="operator_name"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 详情dg -->
    <el-dialog title="定制订单详情" :visible.sync="showCustomDetailDg">
      <custom-detail :order="orderCus"></custom-detail>
      <p style="padding: 10px 0; font-size: 18px; font-weight: bold;">
        订单变更记录
      </p>
      <el-table :data="changeCusRecords">
        <el-table-column label="时间">
          <template slot-scope="scope">
            <p>
              {{
                moment(scope.row.change_time * 1000).format("YYYY-MM-DD HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <p v-if="scope.row.status - 1 >= 0">
              {{ statusList[scope.row.status - 1].label }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="content"></el-table-column>
        <el-table-column label="操作人" prop="operator_name"></el-table-column>
      </el-table>
    </el-dialog>

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
          orderStatus == '已完结' ||
            orderStatus == '已修改' ||
            authList.indexOf('id119') < 0
        "
      ></message>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import Message from "../../components/Message";
import OrderDetail from "../../components/OrderDetail";
import CustomDetail from "../afterSale/components/CustomDetail";
export default {
  name: "ReviewIssues",
  components: {
    Message,
    OrderDetail,
    CustomDetail
  },
  data() {
    return {
      changeRecords: [], // 变更记录
      changeCusRecords: [],
      currOrderId: "", // 当前工单id
      msgImg: "", // 聊天图
      showRecordDg: false,
      showDetailDg: false,
      showCustomDetailDg: false,
      order_type: "",
      // 所有差评理由
      violationReasons: [
        "图片和文案中，均未正确提及品牌名",
        "图片和文案中，均未正确提及产品名",
        "单产品图片少于3张",
        "视频测评低于45秒（抖音不适用）",
        "抖音测评时长不合格（15秒视频测评多产品/1分钟视频里单品测评时长低于15秒）",
        "产品使用方法错误",
        "图片/文案非原创",
        "产品使用感较少，缺少细节描述",
        "没有拆包使用",
        "未按照博主申请理由发布测评",
        "提交测评渠道与平台入驻的渠道不一致",
        "提交的链接中，没有对应产品的测评内容",
        "发布后30天内删除链接",
        "编辑旧链接后作为新测评提交",
        "套装类产品，没有对每件产品进行测评",
        "唇膏、眼影类产品没有手臂或上脸试色",
        "服装类产品（内衣除外）没有上身展示图片",
        "不符合悬赏条件，请仔细检查悬赏内容",
        "不符合报价理由，请仔细检查报价内容",
        "合集超过9个产品",
        "合集测评包含同类竞品"
      ],
      cusReasonDg: false, //定制差评弹窗
      cusReasonChecked: [],
      cusViolationReasons: [
        "提交测评渠道与平台入驻的渠道不一致",
        "发布后30天内删除链接",
        "编辑旧链接后作为新测评提交",
        "不符合定制要求，请仔细检查定制内容"
      ],
      statusList: [
        {
          value: 1,
          label: "待提名"
        },
        {
          value: 2,
          label: "待品牌确认"
        },
        {
          value: 3,
          label: "待发货"
        },
        {
          value: 4,
          label: "待收货"
        },
        {
          value: 5,
          label: "待提交审稿"
        },
        {
          value: 6,
          label: "待审稿确认"
        },
        {
          value: 7,
          label: "待测评"
        },
        {
          value: 8,
          label: "待确认测评"
        },
        {
          value: 9,
          label: "待结算"
        },
        {
          value: 10,
          label: "已完成"
        },
        {
          value: 11,
          label: "已关闭"
        }
      ],
      moment: moment,
      search: {
        ticket_id: "",
        order_id: "",
        brand_name: "",
        page_id: 1,
        page_size: 20,
        status: "待审核",
        cp_nickname: "" // 博主名
      },
      total: 100,
      list: [],
      dateTime: {},
      reasonDg: false, // 差评理由
      reasonChecked: [],
      currIssue: {}, // 当前issue
      order: {
        quote_info: {},
        reward: {
          type: 1,
          form: {},
          rank: {}
        }
      }, // 订单详情
      orderCus: {},
      reviewsType: ["不限形式", "视频", "图文"] //评测形式
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
    // 测评链接点击跳转
    reviewClick(link) {
      if (link.indexOf("http") != 0) {
        link = "http://" + link;
      }
      window.open(link);
    },
    // 查看沟通记录
    async recordClick(id, ordrStatus) {
      this.orderStatus = ordrStatus;
      this.currOrderId = id;
      this.showRecordDg = true;
    },
    // 获取详情
    async getDetail(order_id) {
      let res;
      res = await this.$api.orderDetail({
        order_id: order_id
      });
      if (res.error_code == 0) {
        this.order = res && res.data ? res.data : {};
      } else {
        this.order = null;
      }
    },
    // 获取订单变更记录
    async getChangeRecord(order_id) {
      let res = await this.$api.orderHistoty({
        order_id: order_id
      });
      if (res.error_code == 0) {
        this.changeRecords = Object.keys(res.data).length !== 0 ? res.data : [];
      } else {
        this.changeRecords = null;
      }
    },
    async detailClick(order_id, order_type) {
      this.order_type = order_type;
      if (order_type == 1) {
        await this.getDetail(order_id);
        await this.getChangeRecord(order_id, this.order_type);
        if (this.order && this.changeRecords) {
          this.showDetailDg = true;
        } else {
          this.showDetailDg = false;
        }
      }
      if (order_type == 3) {
        await this.getCustomDetail(order_id);
        await this.getCustomRecord(order_id, this.order_type);
        if (this.orderCus && this.changeCusRecords) {
          this.showCustomDetailDg = true;
        } else {
          this.showCustomDetailDg = false;
        }
      }
    },
    async getCustomRecord(order_id) {
      let res = await this.$api.customOrderHistory({
        order_id: order_id
      });
      if (res.error_code == 0) {
        this.changeCusRecords =
          Object.keys(res.data).length !== 0 ? res.data : [];
      } else {
        this.changeCusRecords = null;
      }
    },
    async getCustomDetail(order_id) {
      let res;
      res = await this.$api.getCustomizedOrderDetail({
        order_id: order_id
      });
      if (res.error_code == 0) {
        this.orderCus = res && res.data ? res.data : {};
      } else {
        this.orderCus = null;
      }
    },
    async checkClick(type) {
      let res = await this.$api.reviewsVerify({
        ticket_id: this.currIssue.ticket_id,
        reason:
          this.order_type == 1 ? this.reasonChecked : this.cusReasonChecked,
        accept: type,
        order_type: this.order_type
      });
      if (res.error_code == 0) {
        this.$message.success("处理成功");
        this.queryList();
        if (this.order_type == 1) {
          this.reasonDg = false;
        } else {
          this.cusReasonDg = false;
        }
      }
    },
    async auditReview(data, type) {
      this.order_type = data.order_type;
      this.currIssue = data;
      if (type) {
        //通过
        if (this.order_type == 1) {
          this.reasonChecked = this.currIssue.violation_reason;
          this.reasonDg = true;
        } else {
          this.cusReasonChecked = this.currIssue.violation_reason;
          this.cusReasonDg = true;
        }
      } else {
        this.$confirm("商家无法再对此订单发起投诉，请确认", "确认拒绝").then(
          async () => {
            this.checkClick(type, this.order_type);
          }
        );
      }
    },
    // 点击重置
    refreshBtnClick() {
      this.search = {
        page_id: 1,
        page_size: 20,
        ticket_id: "",
        order_id: "",
        order_type: "",
        brand_name: "",
        status: "待审核"
      };
      this.queryList();
    },
    async queryList() {
      let req = this.$initReq(this.search);
      let res = await this.$api.getProposalList(req);
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count || 0;
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    }
  }
};
</script>
<style lang="less">
.review-link {
  overflow: hidden;
  line-height: 25px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
