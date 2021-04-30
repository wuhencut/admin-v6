<template>
  <div class="order-list">
    <!--form-->
    <el-form inline>
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
          v-model.trim="search.company_name"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="公司名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.cp_id"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          maxlength="19"
          placeholder="申请人ID"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.cp_nickname"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="申请人昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          v-model.trim="search.order_id"
          @change="searchBtnClick"
          maxlength="19"
          @keyup.enter.native="searchBtnClick"
          placeholder="订单编号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          clearable
          maxlength="19"
          v-model.trim="search.express_number"
          @change="searchBtnClick"
          @keyup.enter.native="searchBtnClick"
          placeholder="物流单号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option label="全部" value="全部"></el-option>
          <el-option label="待审核" value="待审核"></el-option>
          <el-option label="发货/探店" value="发货/探店"></el-option>
          <el-option label="待收货" value="待收货"></el-option>
          <el-option label="待测评" value="待测评"></el-option>
          <el-option label="已测评" value="已测评"></el-option>
          <el-option label="审核逾期" value="审核逾期"></el-option>
          <el-option label="发货逾期" value="发货逾期"></el-option>
          <el-option label="评测逾期" value="评测逾期"></el-option>
          <el-option label="已关闭" value="已关闭"></el-option>
          <el-option label="已取消" value="已取消"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <admin-select
          class="search-inp"
          @change="searchBtnClick"
          v-model="search.admin_id"
          isAll
        ></admin-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.reward_type"
          @change="searchBtnClick"
        >
          <el-option label="全部合作模式" value></el-option>
          <el-option label="接受悬赏" value="CooperationTypeSpread"></el-option>
          <el-option
            label="博主报价"
            value="CooperationTypeSpreadAndQuote"
          ></el-option>
          <el-option
            label="免费置换"
            value="CooperationTypeFreeExchange"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.reward_status"
          @change="searchBtnClick"
        >
          <el-option label="全部悬赏状态(推广/报价)" value></el-option>
          <el-option
            label="待发放"
            value="OrderLogStatusSpreadDefault"
          ></el-option>
          <el-option
            label="已发放"
            value="OrderLogStatusSpreadApprove"
          ></el-option>
          <el-option
            label="不发放"
            value="OrderLogStatusSpreadReject"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.rank_status"
          @change="searchBtnClick"
        >
          <el-option label="全部排名悬赏状态" value></el-option>
          <el-option
            label="已上榜"
            value="OrderLogStatusRankApprove"
          ></el-option>
          <el-option
            label="未上榜"
            value="OrderLogStatusRankReject"
          ></el-option>
        </el-select>
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
          v-if="authList.indexOf('id123') > -1"
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
      <el-table-column label="Id | 品牌名称" width="200">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.order_id }}</p>
            <p>品牌:{{ scope.row.brand_name }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品 | 规格" min-width="200">
        <template slot-scope="scope">
          <div>
            <p>
              <a
                :href="scope.row.production_link || 'javascript:;'"
                target="_new"
                >{{ scope.row.production_title }}</a
              >
            </p>
            <p>规格:{{ scope.row.specification || "/" }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="公司|申请人|申请时间|开始时间" min-width="250">
        <template slot-scope="scope">
          <p>公司:{{ scope.row.company_name }}</p>
          <p>申请人:{{ scope.row.cp_nickname }}</p>
          <p>
            申请时间:{{
              moment(scope.row.apply_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
          <p v-if="scope.row.campaign_start_time">
            开始时间:{{
              moment(scope.row.campaign_start_time * 1000).format(
                "YYYY-MM-DD HH:mm"
              )
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="100">
        <template slot-scope="scope">
          <div>
            <p>{{ scope.row.status }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="合作模式" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.reward_type == 'CooperationTypeSpread'">
            接受悬赏
          </p>
          <p
            v-if="
              scope.row.reward_type == 'CooperationTypeSpreadAndQuote' ||
                scope.row.reward_type == 'CooperationTypeQuote'
            "
          >
            博主报价
          </p>
          <p v-if="scope.row.reward_type == 'CooperationTypeFreeExchange'">
            免费置换
          </p>
          <p v-if="scope.row.reward_type == 'CooperationTypeOld'">老订单</p>
        </template>
      </el-table-column>
      <el-table-column label="悬赏(推广/报价)" width="110">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.reward_status == 'OrderLogStatusSpreadDefault'"
            >待发放</el-tag
          >
          <el-tag
            type="success"
            v-if="scope.row.reward_status == 'OrderLogStatusSpreadApprove'"
            >已发放</el-tag
          >
          <el-tag
            type="danger"
            v-if="scope.row.reward_status == 'OrderLogStatusSpreadReject'"
            >不发放</el-tag
          >
          <el-tag v-if="scope.row.reward_status == ''">无</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排名悬赏" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.rank_status == 'OrderLogStatusRankDefault'"
            >待上榜</el-tag
          >
          <el-tag
            type="success"
            v-if="scope.row.rank_status == 'OrderLogStatusRankApprove'"
            >已上榜</el-tag
          >
          <el-tag
            type="danger"
            v-if="scope.row.rank_status == 'OrderLogStatusRankReject'"
            >未上榜</el-tag
          >
          <el-tag v-if="scope.row.rank_status == ''">无</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="测评剩余天数" width="100">
        <template slot-scope="scope">
          <div>
            <p>{{ Math.floor(scope.row.remain_time / (60 * 60 * 24)) }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <div>
            <div>
              <el-button @click="showBtnClick(scope.row)" type="text"
                >查看详情</el-button
              >
              <el-popover v-if="scope.row.crawler_urls" style="margin: 0 10px;">
                <div>
                  <p
                    style="margin:5px 0;"
                    v-for="(item, index) in scope.row.crawler_urls"
                    :key="index"
                  >
                    <a :href="item" target="_new">{{ item }}</a>
                  </p>
                </div>
                <el-button slot="reference" type="text">测评地址</el-button>
              </el-popover>
              <el-button
                v-if="
                  scope.row.status != '已关闭' && authList.indexOf('id122') > -1
                "
                @click="closeBtnClick(scope.row.order_id, scope.row.cp_id)"
                type="text"
                >关闭订单</el-button
              >
            </div>
            <p>
              <!--<el-button @click="statusBtnClick(scope.row)" type="text">更改状态</el-button>-->
              <el-button @click="recordBtnClick(scope.row)" type="text"
                >变更记录</el-button
              >
              <el-button
                v-if="
                  scope.row.status == '待测评' ||
                    scope.row.status == '已测评' ||
                    scope.row.status == '评测逾期' ||
                    scope.row.status == '待收货'
                "
                @click="expressBtnClick(scope.row)"
                type="text"
                >查看物流</el-button
              >
              <el-button type="text" @click="recordClick(scope.row)"
                >协商记录</el-button
              >
            </p>
          </div>
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
        :page-size="10"
        :current-page="search.page_id"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!--/page-->
    <!--orderDialog-->
    <el-dialog title="订单详情" :visible.sync="orderDialog">
      <order-detail :order="order"></order-detail>
      <div slot="footer">
        <el-button
          v-if="
            ((order.form_reward_info.sub_status == 'OnBoard' &&
              order.form_reward_info.status == 'OrderLogStatusSpreadDefault') ||
              (order.rank_reward_info.sub_status == 'OnBoard' &&
                order.rank_reward_info.status ==
                  'OrderLogStatusRankDefault')) &&
              order.status == '已测评'
          "
          type="primary"
          @click="cancelClick"
          >取消悬赏发放</el-button
        >
      </div>
      <el-dialog title="取消悬赏" append-to-body :visible.sync="cancelDg">
        <p style="padding: 10px 0; font-weight: bold; display: flex;">
          <span style="flex: 1">关闭理由</span>
          <span>操作人: {{ allAdmin[this.cancelInfo.operator] }}</span>
        </p>
        <el-input
          v-model="cancelInfo.reason"
          type="textarea"
          placeholder="请输入关闭悬赏发放的原因"
          :rows="5"
        ></el-input>
        <p style="padding: 10px 0; font-weight: bold;">提示:</p>
        <p>· 操作后无法恢复，请小二谨慎操作</p>
        <p>· 已发放的悬赏类型，无法勾选悬赏类型</p>
        <div slot="footer">
          <el-button type="primary" @click="refuseReward"
            >取消悬赏发放</el-button
          >
          <el-button @click="cancelDg = false">取消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!--/orderDialog-->
    <!--变更记录-->
    <el-dialog title="变更记录" :visible.sync="recordsDialog" width="800px">
      <el-table :data="records">
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
    <!--/变更记录-->
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
          orderStatus == '已关闭' ||
            orderStatus == '已取消' ||
            authList.indexOf('id124') < 0
        "
      ></message>
    </el-dialog>
  </div>
</template>
<script>
import AdminSelect from "../../components/AdminSelect";
import moment from "moment";
import OrderDetail from "../../components/OrderDetail";
import Message from "../../components/Message";
import getUserInfo from "../../api/getUserInfo";

export default {
  components: { AdminSelect, OrderDetail, Message },
  data() {
    return {
      userInfo: getUserInfo(),
      moment: moment,
      currOrderId: "", // 当前订单id
      showRecordDg: false,
      cancelInfo: {}, // 取消悬赏发放对象
      cancelDg: false, // 取消悬赏弹窗
      dateTime: [], // 订单创建时间
      search: {
        production_title: "",
        company_name: "",
        cp_id: "",
        brand_name: "",
        status: "全部",
        page_id: 1,
        admin_id: "0",
        express_number: "", // 物流单号
        order_id: "", // 订单id
        reward_type: "", // 合作模式
        reward_status: "", // 悬赏状态
        rank_status: "", // 排名悬赏状态
        cp_nickname: "" // 申请人昵称
      },
      list: [],
      totalNum: 0,
      order: {
        quote_info: {},
        reward: {
          form: {},
          rank: {}
        },
        form_reward_info: {},
        rank_reward_info: {}
      },
      orderDialog: false,
      records: [],
      recordsDialog: false,
      changeStatus: {},
      statusDialog: false,
      expressDialog: false,
      express: {
        express_company: "",
        express_number: "",
        express_info: []
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
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  mounted() {
    // this.initSearchDate();
    this.listOrder();
  },
  methods: {
    // 查看沟通记录
    async recordClick(data) {
      this.currOrderId = data.order_id || "";
      this.orderStatus = data.status || "";
      this.showRecordDg = true;
    },
    // 拒绝悬赏
    async refuseReward() {
      if (!this.cancelInfo.reason) {
        this.$message.error("请输入拒绝理由");
        return false;
      }
      let res = await this.$api.refuseReward(this.cancelInfo);
      if (res.error_code == 0) {
        this.$message.success("操作成功");
        this.cancelDg = false;
        this.orderDialog = false;
        this.listOrder();
      }
    },
    // 点击拒绝悬赏
    cancelClick() {
      this.cancelInfo = {
        order_id: this.order.order_id,
        reason: "",
        operator: this.userInfo.user_id
      };
      this.cancelDg = true;
    },
    //点击搜索按钮
    searchBtnClick() {
      this.search.page_id = 1;
      this.listOrder();
    },
    async exportBtnClick() {
      let params = JSON.parse(JSON.stringify(this.search));
      let res = await this.$api.orderExport(this.$initReq(params));
      if (res.error_code == 0) {
        location.href = res.data.address;
      }
    },
    //订单列表
    async listOrder() {
      let req = JSON.parse(JSON.stringify(this.search));
      let res = await this.$api.orderList(this.$initReq(req));
      if (res.error_code == 0) {
        this.list = res.data.orders;
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
    //查看详情
    async showBtnClick(item) {
      let res = await this.$api.orderDetail({ order_id: item.order_id });
      if (res.error_code == 0) {
        this.order = res.data || {};
        this.orderDialog = true;
      }
    },
    //点击变更记录
    async recordBtnClick(item) {
      let res = await this.$api.orderHistoty({ order_id: item.order_id });
      if (res.error_code == 0) {
        this.records = res.data || [];
        this.recordsDialog = true;
      } else {
        this.$messaeg.error(res.error_description);
      }
    },
    //点击更改状态
    async statusBtnClick(item) {
      this.changeStatus = JSON.parse(JSON.stringify(item));
      this.statusDialog = true;
    },
    //点击查看物流系
    async expressBtnClick(item) {
      const res = await this.$api.getOrderExpress({
        order_id: item.order_id
      });
      if (res.error_code == 0) {
        this.express = {
          express_company: res.data.express_company,
          express_number: res.data.express_number,
          express_info: res.data.express_info
        };
        if (!this.express.express_number) {
          this.$message.error("暂无物流信息");
          return false;
        }
        this.expressDialog = true;
      } else {
        this.$message.error("系统出错" + res.error_description);
      }
    },
    //点击关闭订单
    closeBtnClick(order_id, cp_id) {
      this.$prompt(
        "请填写关闭理由, 订单关闭后不可恢复, 对应工单都将被关闭, 待重评的工单不会补分",
        "提示",
        {
          inputValidator: val => {
            if (!val || val == "") {
              return "请输入理由";
            }
            return true;
          }
        }
      )
        .then(async val => {
          let res = await this.$api.orderUpdateStatus({
            order_id,
            cp_id,
            remark: val.value,
            status: "6"
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
