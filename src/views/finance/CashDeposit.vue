<template>
  <div class="page-deposit">
    <el-form inline>
      <el-form-item>
        <el-input
          placeholder="保证金账单号"
          class="search-inp"
          maxlength="19"
          v-model.trim="search.order_id"
          @keyup.native.enter="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="商户ID"
          class="search-inp"
          maxlength="19"
          :disabled="first"
          v-model.trim="sponsor_id"
          @keyup.native.enter="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          class="search-inp"
          :fetch-suggestions="filterCompany"
          :disabled="second"
          placeholder="企业名称"
          @select="handleSelect"
          v-model.trim="company_name"
          style="width:160px"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-select class="search-inp" v-model="pay">
          <el-option :value="1" label="支付宝"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select class="search-inp" v-model="style">
          <el-option :value="1" label="品牌协议入驻"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option label="已支付" :value="1"></el-option>
          <el-option label="待退款" :value="2"></el-option>
          <el-option label="已退款" :value="3"></el-option>
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
          class="search-time"
          v-model="date"
          type="daterange"
          align="right"
          start-placeholder="支付时间（终）"
          end-placeholder="支付时间（终）"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- list -->
    <div class="list">
      <el-table :data="list">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="保证金账单号" prop="order_id"></el-table-column>
        <el-table-column label="商户ID" prop="sponsor_id"></el-table-column>
        <el-table-column label="公司名称" prop="company_name"></el-table-column>
        <el-table-column label="支付时间">
          <template slot-scope="scope">
            {{ moment(scope.row.paid_time * 1000).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <p v-if="scope.row.payments == 1">支付宝</p>
          </template>
        </el-table-column>
        <el-table-column label="保证金用途">
          <template slot-scope="scope">
            <p v-if="scope.row.deposit_type == 1">品牌协议入驻</p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 1">已支付</p>
            <p v-if="scope.row.status == 2">待退款</p>
            <p v-if="scope.row.status == 3">已退款</p>
          </template>
        </el-table-column>
        <el-table-column label="BD负责人">
          <template slot-scope="scope">
            {{ allAdmin[scope.row.bd_admin_id] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.status !== 2"
              @click="show(scope.row, 1)"
              >查看</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.status == 2"
              @click="show(scope.row, 2)"
              >线下转账</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.status == 2"
              @click="wayBack(scope.row)"
              >已原路退回</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-show="list.length">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="count"
          @current-change="currentChange"
          :current-page="search.page_id"
        ></el-pagination>
      </div>
    </div>

    <el-dialog title="详情" :visible.sync="detailDg" width="600px">
      <pay-detail :info="info"></pay-detail>
      <p class="p">记录线下转账</p>
      <el-form
        label-width="110px"
        :model="form"
        ref="form"
        :rules="rules"
        :disabled="disabled"
      >
        <el-form-item label="退款方式">
          <el-select v-model="form.sub_channel">
            <el-option label="支付宝" :value="1"></el-option>
            <el-option label="银行卡" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="refund_account"
          :label="form.sub_channel == 1 ? '支付宝账户' : '银行账户'"
        >
          <el-input
            v-model="form.refund_account"
            style="width:300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="退款金额">
          <span>1000元</span>
        </el-form-item>
        <el-form-item
          :label="form.sub_channel == 1 ? '支付宝订单号' : '银行流水号'"
          prop="trade_no"
        >
          <el-input v-model="form.trade_no" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="操作人" v-show="this.type == 1">
          <p>{{ allAdmin[form.operator_id] }}</p>
        </el-form-item>
        <el-form-item label="操作时间" v-show="this.type == 1">
          <p>
            {{ moment(form.refund_time * 1000).format("YYYY-DD-MM HH:mm") }}
          </p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirm"
          v-show="this.info.status == 2"
          >确认提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BdSelect from "../../components/BdSelect";
import moment from "moment";
import payDetail from "./components/payDetail";
export default {
  components: {
    BdSelect,
    payDetail
  },
  data() {
    return {
      moment: moment,
      pay: 1, //支付宝
      style: 1, //品牌协议入驻
      date: "",
      first: false,
      second: false,
      detailDg: false,
      disabled: false,
      type: "",
      info: {},
      list: [],
      count: 0,
      company_name: "",
      sponsor_id: "",
      form: {
        sponsor_id: "",
        order_id: "",
        refund_type: 1,
        sub_channel: 1,
        refund_account: "",
        trade_no: ""
      },
      search: {
        sponsor_id: "",
        order_id: "",
        bd_admin_id: "",
        start_time: 0,
        end_time: 0,
        deposit_type: 0,
        status: 2,
        page_id: 1,
        page_size: 10
      },
      rules: {
        refund_account: [
          {
            required: true,
            message: "请输入打款账户",
            trigger: "blur"
          }
        ],
        trade_no: [
          {
            required: true,
            message: "请输入订单号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  watch: {
    date(val) {
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
    },
    sponsor_id(val) {
      if (val !== "") {
        this.second = true;
        this.search.sponsor_id = val;
      } else {
        this.search.sponsor_id = "";
        this.second = false;
        this.queryList();
      }
    },
    company_name(val) {
      if (val !== "") {
        this.first = true;
      } else {
        this.first = false;
      }
    }
  },
  created() {
    this.queryList();
  },
  methods: {
    handleSelect(item) {
      this.search.sponsor_id = item.sponsor_id;
      this.searchBtnClick();
    },
    async queryList() {
      let res = await this.$api.getDepositList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.count = res.data.count;
      }
    },
    confirm() {
      this.$refs["form"].validate(async ok => {
        if (ok) {
          await this.refundDeposit();
        }
      });
    },
    async refundDeposit() {
      this.form.sponsor_id = this.info.sponsor_id;
      this.form.order_id = this.info.order_id;
      let res = await this.$api.refundDeposit(this.form);
      if (res.error_code == 0) {
        this.$message.success("操作成功！");
        this.detailDg = false;
        this.queryList();
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //筛选商家
    async filterCompany(queryString, cb) {
      if (queryString === "") {
        cb([]);
        return false;
      }
      let req = {
        page_id: 1,
        page_size: 10,
        company_name: queryString
      };
      let res = await this.$api.getBusinessLicenseList(req);
      if (res.error_code == 0) {
        this.companyList = res.data.sponsor_user || [];
        for (let i = 0; i < this.companyList.length; i++) {
          this.companyList[i].value = this.companyList[i].company_name;
        }
      } else {
        this.companyList = [];
      }
      cb(this.companyList);
    },
    showDetail() {
      this.detailDg = true;
    },
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    },
    async wayBack(item) {
      let req = {
        sponsor_id: item.sponsor_id,
        order_id: item.order_id,
        refund_type: 1
      };
      let res = await this.$api.refundDeposit(req);
      if (res.error_code == 0) {
        this.$message.success("操作成功！");
        this.queryList();
      }
    },
    show(item, type) {
      this.disabled = false;
      this.type = type;
      if (type == 1) {
        this.disabled = true;
        this.form = item;
        this.info = item;
      }
      if (type == 2) {
        this.form = {
          sponsor_id: "",
          order_id: "",
          refund_type: 2,
          sub_channel: 1,
          refund_account: "",
          trade_no: ""
        };
        this.info = item;
      }

      this.detailDg = true;
    }
  }
};
</script>
<style lang="less">
.page-deposit .el-dialog__body {
  padding: 10px 20px;
}
</style>
<style lang="less" scoped>
.p {
  font-size: 16px;
  padding: 10px 0;
}
</style>
