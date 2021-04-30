<template>
  <div>
    <div class="table-title">
      <div class="title-left">
        <el-form :inline="true">
          <el-form-item>
            <el-input
              class="search-inp"
              v-model.trim="search.buyer_id"
              placeholder="商户Id"
              maxlength="19"
              @change="searchBtnClick"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              class="search-inp"
              v-model.trim="search.order_id"
              placeholder="订单编号"
              maxlength="19"
              @change="searchBtnClick"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              class="search-inp"
              v-model.trim="search.company_name"
              placeholder="公司名称"
              @change="searchBtnClick"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              class="search-inp"
              v-model="search.channel"
              placeholder="充值方式"
              @change="searchBtnClick"
            >
              <el-option label="所有支付方式" :value="0"></el-option>
              <el-option label="支付宝" :value="1"></el-option>
              <el-option label="银联" :value="2"></el-option>
              <el-option label="赠送" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              class="search-inp"
              v-model="search.type"
              placeholder="订单类型"
              @change="searchBtnClick"
            >
              <el-option label="所有订单类型" value=""></el-option>
              <el-option label="充值" :value="1"></el-option>
              <el-option label="购买置换活动" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              class="search-inp"
              v-model="search.status"
              placeholder="订单状态"
              @change="searchBtnClick"
            >
              <el-option label="所有状态" :value="0"></el-option>
              <el-option label="待支付" :value="1"></el-option>
              <el-option label="已完成" :value="2"></el-option>
              <el-option label="已关闭" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <bd-select
              class="search-inp"
              v-model="search.bd_admin_id"
              isAll
              isNew
              @change="searchBtnClick"
            ></bd-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="uiQuery.date"
              value-format="timestamp"
              type="daterange"
              :default-time="['00:00:00', '23:59:59']"
              start-placeholder="下单时间(始)"
              end-placeholder="下单时间(终)"
            ></el-date-picker>
          </el-form-item>
          <el-form-item inline>
            <el-input
              style="width:100px"
              :maxlength="8"
              v-model.trim="uiQuery.point_start"
              @blur="blurPointStart"
              placeholder="订单金额"
            ></el-input>
            -
            <el-input
              style="width:100px"
              :maxlength="8"
              v-model.trim="uiQuery.point_end"
              @blur="blurPointEnd"
              placeholder="订单金额"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="title-right" style="text-align:right;">
        <el-form>
          <el-form-item>
            <el-button
              v-if="authList.indexOf('id76') > -1"
              icon="el-icon-plus"
              type="primary"
              @click="createOrder(null)"
              >新建订单</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="queryList">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <el-table :data="list">
        <el-table-column
          label="订单编号"
          prop="order_id"
          width="200"
        ></el-table-column>
        <el-table-column
          label="商户ID"
          prop="buyer_id"
          width="200"
        ></el-table-column>
        <el-table-column label="充值方式" prop="channel">
          <template slot-scope="scope">
            <div v-if="scope.row.channel == 1">支付宝</div>
            <div v-if="scope.row.channel == 2">银联</div>
            <div v-if="scope.row.channel == 3">赠送</div>
          </template>
        </el-table-column>
        <el-table-column
          label="公司名称"
          prop="company_name"
          min-width="200"
        ></el-table-column>
        <el-table-column label="BD负责人">
          <template slot-scope="scope">
            {{ allAdmin[scope.row.bd_admin_id] || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="created_at" width="160">
          <template slot-scope="scope">{{
            moment(scope.row.created_at * 1000).format("YYYY-MM-DD HH:mm")
          }}</template>
        </el-table-column>
        <el-table-column label="订单金额" prop="point">
          <template slot-scope="scope">{{ scope.row.point / 100 }}</template>
        </el-table-column>
        <el-table-column label="赠送金额" prop="gift_point">
          <template slot-scope="scope">{{
            scope.row.gift_point ? scope.row.gift_point / 100 : 0
          }}</template>
        </el-table-column>
        <el-table-column label="订单状态" prop="status">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1" style="color:#F7BA2A;">
              待支付
            </div>
            <div v-if="scope.row.status == 2" style="color:#13CE66;">
              已完成
            </div>
            <div v-if="scope.row.status == 3" style="color:#FF4949;">
              已关闭
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" width="100">
          <template slot-scope="scope">{{
            orderTypes[scope.row.type]
          }}</template>
        </el-table-column>
      </el-table>
      <!--page-->
      <div v-if="count > 0" class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          @current-change="currentChange"
          :current-page="search.page_id"
          :page-size="10"
          :total="count"
        ></el-pagination>
      </div>
      <!--/page-->
    </div>
    <div>
      <el-dialog
        title="新建订单"
        :visible.sync="dialogOrder"
        width="600px"
        :close-on-click-modal="false"
      >
        <el-form
          label-width="100px"
          :model="saveParams"
          ref="form"
          :rules="rules"
        >
          <el-form-item label="充值方式:">
            <el-select
              @change="saveParams.point = 0"
              v-model="saveParams.channel"
              placeholder="充值方式"
            >
              <el-option label="支付宝" value="1"></el-option>
              <el-option label="银联" value="2"></el-option>
              <el-option label="赠送" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="商户ID:"
            prop="user_id"
            v-if="
              saveParams.channel == 1 ||
                saveParams.channel == 2 ||
                saveParams.channel == 3
            "
          >
            <el-input
              style="width:300px;"
              @keyup.enter.native="getCompanyName"
              v-model.trim="saveParams.user_id"
              maxlength="19"
            ></el-input>
            <el-button
              @click="getCompanyName"
              :disabled="saveParams.user_id == ''"
              >获取名称</el-button
            >
          </el-form-item>
          <el-form-item label="商户名称">
            <p>{{ company_name }}</p>
          </el-form-item>
          <el-form-item
            label="充值金额:"
            prop="point"
            v-if="saveParams.channel == 1 || saveParams.channel == 2"
          >
            <el-input
              v-model="saveParams.point"
              placeholder="单位(元)"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="赠送金额:"
            prop="gift_point"
            v-if="
              saveParams.channel == 1 ||
                saveParams.channel == 2 ||
                saveParams.channel == 3
            "
          >
            <el-input
              v-model="saveParams.gift_point"
              placeholder="单位(元)"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="支付金额:"
            prop="price"
            v-if="saveParams.channel == 1 || saveParams.channel == 2"
          >
            <el-input
              v-model="saveParams.price"
              placeholder="单位(元)"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="银行:"
            prop="sub_channel"
            v-if="saveParams.channel == 2"
          >
            <el-input v-model="saveParams.sub_channel"></el-input>
          </el-form-item>
          <el-form-item
            label="户名:"
            prop="bank_account_name"
            v-if="saveParams.channel == 2"
          >
            <el-input v-model="saveParams.bank_account_name"></el-input>
          </el-form-item>
          <el-form-item
            label="账号:"
            prop="brand_account_id"
            v-if="saveParams.channel == 2"
          >
            <el-input v-model="saveParams.brand_account_id"></el-input>
          </el-form-item>
          <el-form-item
            label="交易日期:"
            prop="order_time"
            v-if="saveParams.channel == 2"
          >
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="saveParams.order_time"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            prop="trade_no"
            :label="saveParams.channel == 1 ? '交易单号:' : '回单流水号:'"
            v-if="saveParams.channel == 2 || saveParams.channel == 1"
          >
            <el-input v-model="saveParams.trade_no" maxlength="19"></el-input>
          </el-form-item>
          <el-form-item
            label="备注:"
            v-if="
              saveParams.channel == 1 ||
                saveParams.channel == 2 ||
                saveParams.channel == 3
            "
          >
            <el-input
              v-model="saveParams.remark"
              placeholder="备注最多100字"
              type="textarea"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="saveBtnClick" type="primary">创建</el-button>
            <el-button @click="dialogOrder = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import BdSelect from "../../components/BdSelect";
export default {
  components: {
    BdSelect
  },
  data() {
    return {
      count: 0,
      moment,
      dialogOrder: false,
      uiQuery: {
        date: null,
        point_start: "",
        point_end: ""
      },
      search: {
        buyer_id: "",
        order_id: "",
        status: 0,
        page_id: 1,
        page_size: 10,
        company_name: "", //公司名称
        channel: 0, //充值渠道 1支付宝 2银联 3赠送
        point_start: "", //充值金额起
        point_end: "", //充值金额始
        start_time: 0, //开始时间
        end_time: 0, //结束时间
        type: "", //充值
        bd_admin_id: ""
      },
      list: [],
      saveParams: {
        user_id: "",
        order_type: "1",
        channel: "1",
        sub_channel: "",
        point: "",
        gift_point: "",
        price: "",
        trade_no: "",
        bank_account_name: "",
        brand_account_id: "",
        order_time: "",
        remark: ""
      },
      company_name: "",
      orderTypes: ["", "充值", "购买置换活动"],
      orderStatus: ["", "待支付", "已完成", "已关闭"]
    };
  },
  mounted() {
    this.queryList();
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    },
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    rules() {
      return {
        user_id: [
          {
            required: true,
            message: "请输入商户ID",
            trigger: "blur"
          }
        ],
        point: [
          {
            pattern: /^\d+$/,
            required: true,
            message: "请输入整数金额",
            trigger: "blur"
          }
        ],
        gift_point: [
          {
            pattern: /^(\d+)(.\d{0,2})?$/,
            required: this.saveParams.channel == 3 ? true : false,
            message: "请输入整数或者带两位小数的金额",
            trigger: "blur"
          }
        ],
        price: [
          {
            pattern: /^\d+$/,
            required: true,
            message: "请输入整数金额",
            trigger: "blur"
          }
        ],
        trade_no: [
          {
            required: true,
            message: "请输入交易单号",
            trigger: "blur"
          }
        ],
        sub_channel: [
          {
            required: true,
            message: "请输入银行名称",
            trigger: "blur"
          }
        ],
        order_time: [
          {
            required: true,
            message: "请输入交易日期",
            trigger: "blur"
          }
        ],
        bank_account_name: [
          {
            required: true,
            message: "请输入户名",
            trigger: "blur"
          }
        ],
        brand_account_id: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ]
      };
    }
  },
  watch: {
    "saveParams.user_id"() {
      this.company_name = "";
    },
    "uiQuery.date"(val) {
      let date = val || [0, 0];
      this.search.start_time = date[0] / 1000;
      this.search.end_time = date[1] / 1000;
      this.searchBtnClick();
    },
    "search.point_start"() {
      this.searchBtnClick();
    },
    "search.point_end"() {
      this.searchBtnClick();
    }
  },
  methods: {
    //设置订单金额起
    blurPointStart() {
      this.uiQuery.point_start = this.toNumber(this.uiQuery.point_start) || "";
      if (this.uiQuery.point_start !== "" && this.uiQuery.point_end !== "") {
        if (this.uiQuery.point_start < this.uiQuery.point_end) {
          this.search.point_start = this.uiQuery.point_start * 100 + "";
          this.search.point_end = this.uiQuery.point_end * 100 + "";
        } else {
          this.search.point_start = this.uiQuery.point_end * 100 + "";
          this.search.point_end = this.uiQuery.point_start * 100 + "";
        }
      } else {
        this.search.point_start = (this.uiQuery.point_start * 100 || "") + "";
      }
    },
    //设置订单金额始
    blurPointEnd() {
      this.uiQuery.point_end = this.toNumber(this.uiQuery.point_end) || "";
      if (this.uiQuery.point_start !== "" && this.uiQuery.point_end !== "") {
        if (this.uiQuery.point_start < this.uiQuery.point_end) {
          this.search.point_start = this.uiQuery.point_start * 100 + "";
          this.search.point_end = this.uiQuery.point_end * 100 + "";
        } else {
          this.search.point_start = this.uiQuery.point_end * 100 + "";
          this.search.point_end = this.uiQuery.point_start * 100 + "";
        }
      } else {
        this.search.point_end = (this.uiQuery.point_end * 100 || "") + "";
      }
    },
    toNumber(str) {
      let number = parseInt(str) || 0;
      return number > 0 ? number : -number;
    },
    //获取公司名称
    async getCompanyName() {
      if (this.saveParams.user_id == "") {
        return false;
      }
      let req = {
        page_id: 1,
        page_size: 1,
        sponsor_id: this.saveParams.user_id,
        status: -1
      };
      let res = await this.$api.sponsorSearch(req);
      if (res.error_code == 0) {
        if (
          res.data &&
          res.data.sponsor_user &&
          res.data.sponsor_user.length == 1
        ) {
          this.company_name = res.data.sponsor_user[0].company_name;
        } else {
          this.$message.error("获取失败,请核对id");
          this.company_name = "";
        }
      } else {
        this.$message.error("获取失败,请核对id");
        this.company_name = "";
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      if (!/\d+/.test(this.search.buyer_id) && this.search.buyer_id != "") {
        this.$message.error("商户id为数字");
        return;
      }
      let req = this.$initReq(this.search);
      let res = await this.$api.getPayOrderList(req);
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.count = res.data.count;
      } else {
        this.$message.error("查询失败");
      }
    },
    //点击新建订单按钮
    createOrder() {
      this.dialogOrder = true;
      this.saveParams = {
        user_id: "",
        order_type: "1",
        channel: "1",
        sub_channel: "",
        point: "",
        gift_point: "",
        price: "",
        trade_no: "",
        bank_account_name: "",
        brand_account_id: "",
        order_time: "",
        remark: ""
      };
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    saveBtnClick() {
      if (this.company_name == "") {
        this.$message.error("请验证商户名称");
        return false;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$confirm(
            "确认给[" +
              this.company_name +
              "]充值 " +
              (this.saveParams.point || 0) +
              " 元,赠送 " +
              (this.saveParams.gift_point || 0) +
              " 元",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          )
            .then(async () => {
              let params = {};
              if (this.saveParams.channel == 1) {
                params.channel = 1;
                params.user_id = this.saveParams.user_id;
                params.point = this.saveParams.point * 100 + "";
                params.gift_point =
                  (this.saveParams.gift_point * 100).toFixed(0) + "";
                params.price = this.saveParams.price * 100 + "";
                params.trade_no = this.saveParams.trade_no;
                params.remark = this.saveParams.remark;
                params.sub_channel = "手动交易";
              } else if (this.saveParams.channel == 2) {
                params.channel = 2;
                params.user_id = this.saveParams.user_id;
                params.point = this.saveParams.point * 100 + "";
                params.gift_point =
                  (this.saveParams.gift_point * 100).toFixed(0) + "";
                params.price = this.saveParams.price * 100 + "";
                params.sub_channel = this.saveParams.sub_channel;
                params.bank_account_name = this.saveParams.bank_account_name;
                params.brand_account_id = this.saveParams.brand_account_id;
                params.trade_no = this.saveParams.trade_no;
                params.order_time = moment(this.saveParams.order_time).format(
                  "X"
                );
                params.remark = this.saveParams.remark;
              } else if (this.saveParams.channel == 3) {
                params.channel = 3;
                params.user_id = this.saveParams.user_id;
                params.gift_point =
                  (this.saveParams.gift_point * 100).toFixed(0) + "";
                params.remark = this.saveParams.remark;
              } else {
                this.$message.error("不支持的channel");
              }
              let res = await this.$api.newPayOrder(params);
              if (res && res.error_code == 0) {
                this.$message.success("新建订单成功");
                await this.queryList();
                this.dialogOrder = false;
              } else {
                this.$message.error("新建订单失败");
              }
            })
            .catch(() => {
              return false;
            });
        }
      });
    },
    prveBtnClick() {
      this.search.page_id = this.search.page_id - 1;
      this.queryList();
    },
    nextBtnClick() {
      this.search.page_id = this.search.page_id + 1;
      this.queryList();
    },
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    }
  }
};
</script>
<style lang="less" scoped>
.table-title {
  display: flex;
  > .title-left {
    flex: 1;
  }
}
.pagination {
  text-align: center;
  margin: 10px 0;
}
</style>
