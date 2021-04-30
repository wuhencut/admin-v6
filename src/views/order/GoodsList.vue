<template>
  <div class="order-list">
    <!--form-->
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.order_id"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="订单编号"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.production_title"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.brand_name"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="品牌名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.company"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="公司名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.user_name"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="买家昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.inviter_name"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="邀请名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.express_number"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="物流单号"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          maxlength="19"
          v-model.trim="search.trade_id"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="交易单号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="search.buy_type"
          @change="searchBtnClick"
          class="search-inp"
        >
          <el-option value label="全部购买方式"></el-option>
          <el-option :value="1" label="站内纯购买"></el-option>
          <el-option :value="2" label="站内晒单购买"></el-option>
          <el-option :value="3" label="站外晒单购买"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option label="全部订单状态" value="全部"></el-option>
          <el-option label="待付款" value="待付款"></el-option>
          <el-option label="待发货" value="待发货"></el-option>
          <el-option label="待收货" value="待收货"></el-option>
          <el-option label="待晒单" value="待晒单"></el-option>
          <el-option label="交易完成" value="交易完成"></el-option>
          <el-option label="交易关闭" value="交易关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.sub_status"
          @change="searchBtnClick"
        >
          <el-option label="全部退款状态" value="全部"></el-option>
          <el-option label="买家申请退款" value="买家申请退款"></el-option>
          <el-option label="商家同意退货" value="商家同意退货"></el-option>
          <el-option label="买家退货给商家" value="买家退货给商家"></el-option>
          <el-option label="退款成功" value="退款成功"></el-option>
          <el-option label="退款失败" value="退款失败"></el-option>
          <el-option label="退款关闭" value="退款关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易完成时间:">
        <el-date-picker
          class="search-time"
          v-model="dealTime"
          type="daterange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="订单创建时间:">
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
          v-if="authList.indexOf('id126') > -1"
          @click="exportBtnClick"
          icon="el-icon-download"
          >导出表格</el-button
        >
      </el-form-item>
    </el-form>
    <!--/form-->
    <!--table-->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号| 交易单号 | 商品 | 规格" width="200">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.order_id }}</p>
            <p>{{ scope.row.trade_id }}</p>
            <p>{{ scope.row.production_title }}</p>
            <p>{{ scope.row.spec }} {{ scope.row.level_two_spec }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单价 | 数量">
        <template slot-scope="scope">
          <div>
            <p>￥{{ scope.row.production_price }}</p>
            <p>{{ scope.row.production_number }} 件</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="下单时间 | 结算完成时间" width="170">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
          <p>
            {{
              scope.row.settlement_time > 0
                ? moment(scope.row.settlement_time * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                : "-"
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" width="150">
        <template slot-scope="scope">
          <p>昵称:{{ scope.row.user_name }}</p>
          <p v-if="scope.row.recipient">姓名:{{ scope.row.recipient }}</p>
          <p v-if="scope.row.telephone">电话:{{ scope.row.telephone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="公司 | 品牌" width="150">
        <template slot-scope="scope">
          <p>{{ scope.row.company }}</p>
          <p>{{ scope.row.brand_name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="购买方式">
        <template slot-scope="scope">{{
          scope.row.buy_type == 3 ? "淘宝购买" : "映兔购买"
        }}</template>
      </el-table-column>
      <el-table-column label="实付金额 | 邀请名 | 邀请人ID" width="180">
        <template slot-scope="scope">
          <p>￥{{ scope.row.trade_price || "-" }}</p>
          <p>{{ scope.row.inviter_name || "-" }}</p>
          <p>{{ scope.row.inviter_id || "-" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="晒单奖励" width="130">
        <template slot-scope="scope">
          <p v-if="scope.row.buy_type != 1">
            {{ scope.row.rebate.rebate_point / 100
            }}{{ scope.row.buy_type == 3 ? "映币" : "元" }}
          </p>
          <el-tag>{{ scope.row.rebate.rebate_status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="返利补贴" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.subsidy && scope.row.subsidy.source !== 0">
            <p>{{ scope.row.subsidy.amount / 100 }}映币</p>
            <p>
              {{
                ["商家补贴", "部门补贴", "平台补贴"][
                  scope.row.subsidy.source - 1
                ]
              }}
            </p>
          </div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status"></el-table-column>
      <el-table-column
        label="退款状态"
        prop="sub_status"
        width="100"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <!-- v-if="scope.row.rebate.submited"   -->
          <el-button
            v-if="scope.row.rebate.submited"
            type="text"
            @click="reviewClick(scope.row.order_id)"
            >查看晒单</el-button
          >
          <el-button
            v-if="
              (scope.row.status == '待发货' ||
                scope.row.status == '待晒单' ||
                scope.row.status == '待收货') &&
                authList.indexOf('id125') > -1
            "
            type="text"
            @click="closeClick(scope.row.order_id)"
            >关闭订单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--/table-->
    <!--page-->
    <div class="pagination" v-if="totalNum > 0">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        :page-size="20"
        :current-page="search.page_id"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!--/page-->
    <!-- 查看物流 -->
    <el-dialog title="物流信息" :visible.sync="expressDialog" width="800px">
      <table class="in-table">
        <tr>
          <td>{{ express.express_company }}</td>
          <td>{{ express.express_number }}</td>
        </tr>
        <tr v-for="(item, index) in express.express_info" :key="index">
          <td width="150">
            {{ moment(item.update_time * 1000).format("YYYY-MM-DD HH:mm") }}
          </td>
          <td>{{ item.content }}</td>
        </tr>
      </table>
    </el-dialog>
    <!-- /查看物流 -->
    <!-- 查看晒单 -->
    <el-dialog title="查看晒单" :visible.sync="showOrderDg">
      <div class="dialog-tip">
        晒单渠道：{{ reviewList.join("和") }}<br />
        计划返利：{{ shouldFeedback / 100
        }}{{ verifyInfo.buy_type == 3 ? "映币" : "元" }} <br />
        发放渠道：{{
          verifyInfo.reviewed
            ? passedList.length
              ? passedList.join("和")
              : "-"
            : "待审核"
        }}
        <br />
        实际返还：<span v-if="verifyInfo.reviewed"
          >{{ indeedFeedback / 100
          }}{{ verifyInfo.buy_type == 3 ? "映币" : "元" }}</span
        ><span v-else>待审核</span><br />
        要求：3张图以上，提及品牌产品名和使用感受 <br />
      </div>
      <!-- 测评链接 正式测评 -->
      <div style="margin-top: 16px;">
        <p><b>正式测评</b></p>
        <template v-if="verifyInfo && verifyInfo.format_list">
          <span
            v-for="(channel, index) in verifyInfo.format_list"
            style="margin-right: 10px;"
            :key="index"
          >
            <el-link
              type="primary"
              @click="goPlatformUrl(channel.appraisal_url)"
              >{{ $getPlatformName(channel.source) }}</el-link
            >
          </span>
        </template>
      </div>
      <!-- 追加测评 -->
      <div v-if="verifyInfo.append_list" style="margin-top: 16px;">
        <p><b>追加测评</b></p>
        <template v-if="verifyInfo && verifyInfo.append_list">
          <span
            style="margin-right: 10px;"
            v-for="(channel, index) in verifyInfo.append_list"
            :key="index"
          >
            <el-link
              type="primary"
              @click="goPlatformUrl(channel.appraisal_url)"
              >{{ $getPlatformName(channel.source) }}</el-link
            >
          </span>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import { goPlatformUrl } from "../../utils/platform";
import getUserInfo from "../../api/getUserInfo";

export default {
  data() {
    return {
      userInfo: getUserInfo(),
      goPlatformUrl: goPlatformUrl,
      reviewList: [], //晒单渠道
      passedList: [], // 合格晒单渠道
      verifyStatusText: "", // 审核状态文字展示
      verifyInfo: {}, // 晒单信息
      shouldFeedback: 0, // 返利金额
      indeedFeedback: 0, // 实际返利金额
      showOrderDg: false, // 查看晒单dialog
      moment: moment,
      dateTime: [],
      search: {
        production_title: "",
        company: "",
        user_name: "",
        brand_name: "",
        start_time: "",
        end_time: "",
        status: "全部",
        page_id: 1,
        express_number: "", // 物流单号
        order_id: "", // 订单id
        page_size: 20,
        sub_status: "全部",
        inviter_name: "",
        finish_time_start: "",
        finish_time_end: "", // 交易时间
        buy_type: "" // 站内购买
      },
      list: [],
      totalNum: 0,
      order: {},
      orderDialog: false,
      records: [],
      changeStatus: {},
      statusDialog: false,
      expressDialog: false,
      express: {
        express_company: "",
        express_number: "",
        express_info: []
      },
      dealTime: localStorage.getItem("dealTimeSearch") // 交易完成时间
        ? JSON.parse(localStorage.getItem("dealTimeSearch"))
        : null
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    // 交易时间
    dealTime(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.finish_time_start = 0;
        this.search.finish_time_end = 0;
      } else {
        this.search.finish_time_start = moment(val[0]).unix();
        this.search.finish_time_end = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    },
    // 订单创建时间
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
    this.listOrder();
  },
  methods: {
    async closeClick(order_id) {
      this.$prompt(
        "关闭后不可恢复，订单金额将退还给商家或博主。非极端情况，请先联系博主主动退款",
        "确认关闭",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^.{2,}$/,
          inputErrorMessage: "请输入两个字以上的备注"
        }
      ).then(async ({ value }) => {
        let res = await this.$api.closeStartOrder({
          order_id: order_id,
          remark: value
        });
        if (res.error_code == 0) {
          this.$message.info("已关闭");
          this.listOrder();
        }
      });
    },
    // 查看晒单
    async reviewClick(order_id) {
      this.shouldFeedback = 0;
      this.indeedFeedback = 0;
      this.reviewList = [];
      this.passedList = [];
      let res = await this.$api.feedbackVerifyInfo({ order_id });
      if (res.error_code == 0) {
        this.verifyInfo = res.data;
        for (let item of this.verifyInfo.result_list) {
          this.reviewList.push(this.$getPlatformName(item.source));
          this.shouldFeedback += item.rebate;
          if (item.status == 1) {
            this.passedList.push(this.$getPlatformName(item.source));
            this.indeedFeedback += item.rebate;
          }
        }
        this.showOrderDg = true;
      }
    },
    //点击搜索按钮
    searchBtnClick() {
      this.search.page_id = 1;
      this.listOrder();
    },
    async exportBtnClick() {
      let params = JSON.parse(JSON.stringify(this.search));
      delete params.page_id;
      delete params.page_size;
      let res = await this.$api.starOrderExport(this.$initReq(params));
      if (res.error_code == 0) {
        window.open(res.data.file_link, "_blank");
      }
    },
    //订单列表
    async listOrder() {
      let req = this.$initReq(JSON.parse(JSON.stringify(this.search)));
      let res = await this.$api.getGoodsList(req);
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.totalNum = res.data.count;
      }
    },
    prveBtnClick() {
      this.search.page_id--;
      this.listOrder();
    },
    nextBtnClick() {
      this.search.page_id++;
      this.listOrder();
    },
    //分页
    currentChange(val) {
      this.search.page_id = val;
      this.listOrder();
    },
    //点击更改状态
    async statusBtnClick(item) {
      this.changeStatus = JSON.parse(JSON.stringify(item));
      this.statusDialog = true;
    },
    //点击查看物流系
    async expressBtnClick(item) {
      const res = await this.$api.getOrderExpress({
        order_id: item.orderId
      });
      if (res.error_code == 0) {
        this.express = {
          express_company: res.data.express_company,
          express_number: res.data.express_number,
          express_info: res.data.express_info || []
        };
        this.expressDialog = true;
      } else {
        this.$message.error("系统出错" + res.error_description);
      }
    },
    //点击关闭订单
    closeBtnClick(order_id, user_id) {
      this.$prompt("请填写关闭理由，订单关闭后不可恢复！", "提示", {
        inputValidator: val => {
          if (!val || val == "") {
            return "请输入理由";
          }
          return true;
        }
      })
        .then(async val => {
          let res = await this.$api.orderUpdateStatus({
            order_id,
            user_id,
            remark: val.value,
            status: "6",
            operator_id: this.userInfo.user_id
          });
          if (res.error_code == 0) {
            this.$message.success("关闭成功");
            this.listOrder();
          }
        })
        .catch(() => {
          return false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.order-list {
  .pagination {
    text-align: center;
    margin: 10px 0;
  }
  .order {
    p {
      label {
        color: #999;
      }
    }
  }
  .more-good-info {
    position: absolute;
    top: 0px;
  }
}
</style>
