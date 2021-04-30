<template>
  <div class="cp-list">
    <!--form-->
    <el-form inline>
      <el-form-item label="企业名称">
        <el-input
          class="search-inp"
          v-model.trim="search.company_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="请输入企业名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option :value="0" label="全部申请"></el-option>
          <el-option :value="1" label="待处理"></el-option>
          <el-option :value="2" label="已通过"></el-option>
          <el-option :value="3" label="已拒绝"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtnClick"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button
          style="float: right; margin-bottom: 10px;"
          class="export-btn"
          type="primary"
          @click="exportWithdrawList"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index"></el-table-column>
      <!--<el-table-column type="selection"></el-table-column> &lt;!&ndash; 多选框 &ndash;&gt;-->
      <el-table-column
        label="单号"
        prop="order_id"
        width="200"
      ></el-table-column>
      <el-table-column
        label="企业名称"
        prop="company_name"
        width="150"
      ></el-table-column>
      <el-table-column label="退款金额(元)" width="110">
        <template slot-scope="scope">{{
          scope.row.withdraw_account / 100
        }}</template>
      </el-table-column>
      <el-table-column label="申请时间" prop="create_time" min-width="200">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" width="150">
        <template slot-scope="scope">
          <p
            :class="{
              'txt-red': scope.row.status == 3,
              'txt-green': scope.row.status == 2
            }"
          >
            {{
              scope.row.status == 2
                ? "已通过"
                : scope.row.status == 3
                ? "已拒绝"
                : "待处理"
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" width="200" fixed="right">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.status == 1
                ? "------"
                : moment(scope.row.update_time * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <p>
            <el-button type="text" @click="showInfo(scope.row)"
              >查看详情</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!--<div style="margin-top: 20px; float: left">
      <el-button type="primary" @click="toggleSelection(list)">全选</el-button>
      <el-select v-model="deal_status" style="width: 120px;">
        <el-option :value="0" label="批量通过"></el-option>
        <el-option :value="1" label="批量拒绝"></el-option>
      </el-select>
      <el-button type="primary" @click="searchBtnClick">确认</el-button>
		</div>-->
    <!-- 全选操作下个版本做 -->
    <!--page-->
    <div class="pagination">
      <div class="page" v-if="page_total > 0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="search.page_id"
          :page-size="search.page_size"
          layout="total, prev, pager, next, jumper"
          :total="page_total"
        ></el-pagination>
      </div>
    </div>
    <!--/page-->
    <el-dialog title="详情" :visible.sync="withdrawDialog">
      <span
        >申请时间：
        {{
          moment(withdrawInfo.create_time * 1000).format("YYYY-MM-DD HH:mm")
        }}</span
      >
      <span style="margin-left:20px;"
        >处理时间:
        {{
          withdrawInfo.status == 1
            ? "------"
            : moment(withdrawInfo.update_time * 1000).format("YYYY-MM-DD HH:mm")
        }}</span
      >
      <table cellspacing="0" class="info-table">
        <tr>
          <td>单号</td>
          <td>{{ withdrawInfo.order_id }}</td>
        </tr>
        <tr>
          <td>处理状态</td>
          <td
            :class="{
              'txt-red': withdrawInfo.status == 3,
              'txt-green': withdrawInfo.status == 2
            }"
          >
            {{
              withdrawInfo.status == 1
                ? "待处理"
                : withdrawInfo.status == 2
                ? "已通过"
                : "已拒绝"
            }}
          </td>
        </tr>
        <tr>
          <td>账户ID</td>
          <td>{{ withdrawInfo.sponsor_id }}</td>
        </tr>
        <tr>
          <td>企业名称</td>
          <td>{{ withdrawInfo.company_name }}</td>
        </tr>
      </table>

      <table cellspacing="0" class="info-table">
        <tr>
          <td>支付方式</td>
          <td>{{ withdrawInfo.pay_channel == 1 ? "支付宝" : "银行" }}</td>
        </tr>
        <tr>
          <td>户名</td>
          <td>{{ withdrawInfo.pay_account_name }}</td>
        </tr>
        <tr>
          <td>账号</td>
          <td>{{ withdrawInfo.pay_account }}</td>
        </tr>
        <tr v-if="withdrawInfo.pay_channel == 2">
          <td>开户行</td>
          <td>{{ withdrawInfo.pay_bank_name }}</td>
        </tr>
        <tr>
          <td>退款金额（元）</td>
          <td>{{ withdrawInfo.withdraw_account / 100 }}</td>
        </tr>
        <tr>
          <td>账户余额（映币）</td>
          <td>{{ withdrawInfo.account / 100 }}</td>
        </tr>
        <tr>
          <td>赠送金额余额（映币）</td>
          <td>{{ withdrawInfo.gift_point / 100 }}</td>
        </tr>
        <tr>
          <td>充值金额余额（映币）</td>
          <td>{{ withdrawInfo.point / 100 }}</td>
        </tr>
        <tr>
          <td>收入金额余额（映币）</td>
          <td>{{ withdrawInfo.income / 100 }}</td>
        </tr>
        <tr>
          <td>退款理由</td>
          <td>{{ withdrawInfo.remark }}</td>
        </tr>
      </table>

      <div v-if="withdrawInfo.status == 1" class="opera-btn">
        <el-button type="primary" @click="confirmRefound(2)"
          >确认退款</el-button
        >
        <el-button type="danger" @click="confirmRefound(3)">拒绝退款</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import { BASEURL } from "../../api/baseUrl";

export default {
  data() {
    return {
      moment: moment,
      deal_status: 0, //操作选择
      date: "", //日期组件，格式化生成start_time、end_time
      page_total: 0, // 数据总条数
      search: {
        status: 0,
        start_time: "", // 开始时间
        end_time: "", // 结束时间
        company_name: "", //公司名称
        page_size: 10,
        page_id: 1
      },
      list: [],
      withdrawDialog: false,
      cpInfo: {
        //cp信息
        user: "",
        source: [],
        status: 0,
        tag: []
      },
      tagDialog: false, //博主打标信息
      tagList: [],
      multipleSelection: [], //多选框列表
      withdrawInfo: {
        create_time: "", //申请时间
        update_time: "------", //处理时间
        order_id: "", //单号
        status: 0, //处理状态
        sponsor_id: "", //账户id
        company_name: "", //企业名称
        pay_channel: "支付宝", //支付方式
        pay_account: "", //账号
        pay_account_name: "", //户名
        withdraw_account: "", //提现金额 （分）
        account: "", //账户总余额 (分)
        gift_point: "", //当前账户赠送余额 （分）
        point: "", // 当前账户充值余额（分）
        remark: "", // 退款理由
        pay_bank_name: "" //开户行
      }
    };
  },
  //监听date变化， 搜索list
  watch: {
    date(val) {
      if (val == null) {
        var todayYear = new Date().getFullYear();
        var todayMonth = new Date().getMonth();
        var todayDay = new Date().getDate();
        var endTime =
          new Date(
            todayYear,
            todayMonth,
            todayDay,
            "23",
            "59",
            "59"
          ).getTime() / 1000; //秒
        this.search.start_time = 0;
        this.search.end_time = endTime;
      } else {
        this.search.start_time = moment(val[0]).unix(); //unix: 将时间转换成秒
        this.search.end_time = moment(
          moment(val[1]).format("YYYY-MM-DD") + " 23:59:59"
        ).unix(); // 第二天要算到23：59：59，默认是00：00：00 这样是不对的，所以要加23
      }
      this.searchBtnClick();
    }
  },
  mounted() {
    //获取当天0点和23:59:59的时间戳
    this.getTodayTime(); //取今天的时间
    this.searchBtnClick();
    this.getTagList();
  },
  methods: {
    //拒绝退款
    confirmRefound(type) {
      if (type == 2) {
        this.$confirm("确认给商户退款吗？！？！？！", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.confirmWithdraw(2);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.$confirm("拒绝给商户退款吗？！？！？！", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.confirmWithdraw(3);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    //分页 - 选择页面
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.withDrawSearch();
    },
    //部分选择 - 底部 默认选择全部，后续可针对需求更改功能
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //获取今天开始和结束的时间戳
    getTodayTime() {
      var todayYear = new Date().getFullYear();
      var todayMonth = new Date().getMonth();
      var todayDay = new Date().getDate();
      // var startTime =
      //   new Date(todayYear, todayMonth, todayDay, "00", "00", "00").getTime() /
      //   1000; //秒
      var endTime =
        new Date(todayYear, todayMonth, todayDay, "23", "59", "59").getTime() /
        1000; //秒
      this.search.start_time = 0;
      this.search.end_time = endTime;
    },
    //全选 - 头部 / 底部
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //导出数据
    exportWithdrawList() {
      window.location.href =
        BASEURL +
        "/admin/pay/sponsor/v1/withdraw/audit_list_export?status=" +
        this.search.status +
        "&start_time=" +
        this.search.start_time +
        "&end_time=" +
        this.search.end_time +
        "&company_name=" +
        this.search.company_name +
        "&page_size=" +
        this.page_total + //这边要抓取所有条件相关的数据，不采取分页导出
        "&page_id=1";
    },
    //getTagList 获取标签列表
    async getTagList() {
      let res = await this.$api.getTagList({});
      if (res.error_code == 0) {
        this.tagList = res.data.tag;
      }
    },
    //退款信息列表
    async withDrawSearch() {
      let req = JSON.parse(JSON.stringify(this.search));
      req.userId = req.userId || "0";
      let res = await this.$api.searchWithdraw(this.$initReq(req));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.page_total = res.data.count;
      }
    },
    //点击搜索按钮
    async searchBtnClick() {
      this.search.page_id = 1;
      this.withDrawSearch();
    },
    //显示博主详情
    showInfo(item) {
      this.withdrawInfo = {
        create_time: item.create_time, //申请时间
        update_time: item.update_time, //处理时间
        order_id: item.order_id, //单号
        status: item.status, //处理状态
        sponsor_id: item.sponsor_id, //账户id
        company_name: item.company_name, //企业名称
        pay_channel: item.pay_channel, //支付方式
        pay_account: item.pay_account, //账号
        withdraw_account: item.withdraw_account || 0, //提现金额
        account: item.account || 0, //账户总余额 (分)
        gift_point: item.gift_point || 0, //当前账户赠送余额 （分）
        point: item.point || 0, // 当前账户充值余额（分）
        remark: item.remark || "无", // 退款理由
        pay_account_name: item.pay_account_name || "", //户名
        pay_bank_name: item.pay_bank_name || "", //开户行
        income: item.income // 充值余额
      };
      this.withdrawDialog = true;
    },
    //点击编辑标签
    editTagBtnClick() {
      this.tagDialog = true;
    },
    //点击保存按钮
    async saveBtnClick() {
      let res = await this.$api.cpModify(this.cpInfo);
      if (res.error_code == 0) {
        this.$message.success("操作成功");
        this.withdrawDialog = false;
      }
    },
    prveBtnClick() {
      this.search.page--;
      this.withDrawSearch();
    },
    nextBtnClick() {
      this.search.page++;
      this.withDrawSearch();
    },
    //冻结
    frozenBenClick(item) {
      let cp = JSON.parse(JSON.stringify(item));
      cp.status = 1;
      this.updateStatus(cp);
    },
    //解冻
    unfrozenBenClick(item) {
      let cp = JSON.parse(JSON.stringify(item));
      cp.status = 0;
      this.updateStatus(cp);
    },
    //更改账户状态
    updateStatus(item) {
      let message = item.status == 1 ? "确定冻结账户吗？" : "确定解冻账户吗？";
      this.$confirm(message, "操作提示")
        .then(async () => {
          let res = await this.$api.cpModify(item);
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.withDrawSearch();
          }
        })
        .catch(() => {
          return false;
        });
    },

    //退款操作
    async confirmWithdraw(type) {
      let req = {
        order_id: this.withdrawInfo.order_id,
        status: type
      };
      let res = await this.$api.confirmWithdraw(req);
      if (res.error_code == 0) {
        this.$message.success("处理成功");
        this.withDrawSearch();
      }

      this.withdrawDialog = false;
    }
  }
};
</script>
<style lang="less" scoped>
.cp-list {
  .pagination {
    text-align: center;
    margin: 10px 0;
  }
  .tag + .tag {
    margin-left: 10px;
  }
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
  width: 200px;
  /*background-color: #c5c5c5;*/
}
</style>
