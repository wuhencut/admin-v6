<template>
  <div class="order-list">
    <div class="header">
      <el-form inline>
        <el-form-item>
          <el-input
            class="search-inp"
            placeholder="订单编号"
            v-model.trim="search.order_id"
            maxlength="19"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            class="search-inp"
            :fetch-suggestions="filterCompany"
            placeholder="企业名称"
            @select="handleSelectOne"
            v-model.trim="company_name"
            style="width:160px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            class="search-inp"
            :fetch-suggestions="filterBrand"
            placeholder="品牌名称"
            @select="handleSelectTwo"
            v-model.trim="brand_name"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            class="search-inp"
            :fetch-suggestions="filterProduction"
            placeholder="商品名称"
            @select="handleSelectThree"
            v-model.trim="production_name"
            style="width:250px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search-inp"
            placeholder="活动ID"
            v-model.trim="search.campaign_id"
            maxlength="19"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search-inp"
            placeholder="博主ID"
            v-model.trim="search.cp_id"
            maxlength="19"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            class="search-inp"
            :fetch-suggestions="filterTeam"
            placeholder="联盟战队"
            @select="handleSelectFour"
            v-model.trim="s_team_name"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-select
            class="search-inp"
            v-model="search.status"
            @change="searchBtnClick"
          >
            <el-option value label="全部状态"></el-option>
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最晚交稿">
          <el-date-picker
            class="search-time"
            align="right"
            v-model="dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="searchBtnClick"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh-right" @click="reset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table :data="list">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_id"></el-table-column>
        <el-table-column label="商品｜规格" min-width="100px">
          <template slot-scope="scope">
            <div>
              <p>{{ scope.row.production.name }}</p>
              <p>规格: {{ scope.row.spec.name }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="企业名称｜品牌" min-width="100px">
          <template slot-scope="scope">
            <div>
              <p>{{ scope.row.company.name }}</p>
              <p>{{ scope.row.brand.name }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="定制博主｜申请时间" min-width="100px">
          <template slot-scope="scope">
            <div>
              <p>{{ scope.row.cp.name }}</p>
              <p>
                {{
                  moment(scope.row.create_time * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="定制报价">
          <template slot-scope="scope">
            <p>{{ scope.row.quoted_price / 100 }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p v-if="scope.row.status - 1 >= 0">
              {{ statusList[scope.row.status - 1].label }}
            </p>
            <el-tag type="danger" v-if="scope.row.ticket">投诉处理中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前状态时长">
          <template slot-scope="scope">
            <p>
              {{
                Math.ceil(
                  (new Date().getTime() -
                    scope.row.current_status_time * 1000) /
                    (24 * 60 * 60 * 1000)
                )
              }}天
            </p>
          </template>
        </el-table-column>
        <el-table-column label="最晚交稿">
          <template slot-scope="scope">
            <p>{{ moment(scope.row.deadline * 1000).format("YYYY-MM-DD") }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <div>
              <order-detail
                :params="scope.row"
                @refresh="queryList"
                v-if="authList.indexOf('id1611715814') > -1"
              ></order-detail>
              <el-button
                type="text"
                @click="closeBtnClick(scope.row)"
                v-if="
                  scope.row.status !== 11 &&
                    authList.indexOf('id1611715856') > -1
                "
                >关闭订单</el-button
              >
              <el-button type="text" @click="recordBtnClick(scope.row)"
                >变更记录</el-button
              >
            </div>
            <div>
              <el-button type="text" @click="recordClick(scope.row)"
                >协商记录</el-button
              >
              <el-button
                type="text"
                @click="expressBtnClick(scope.row)"
                v-if="
                  scope.row.status == 4 || //待收货
                  scope.row.status == 5 || //待提交审稿
                  scope.row.status == 6 || //待审稿确认
                  scope.row.status == 7 || //待测评
                  scope.row.status == 8 || //待测评确认
                  scope.row.status == 9 || //待结算
                    scope.row.status == 10 //已完成
                "
                >查看物流</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-if="total > 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
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
        :msgDisabled="authList.indexOf('id1611726005') < 0"
      ></message>
    </el-dialog>
    <!-- 协商记录弹窗 -->
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
    <!-- 变更记录 -->
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
    <!-- 变更记录 -->
  </div>
</template>
<script>
import OrderDetail from "../../views/team/components/orderDetail";
import moment from "moment";
import Message from "../../components/Message";
export default {
  components: {
    OrderDetail,
    Message
  },
  data() {
    return {
      moment: moment,
      records: [], //变更记录
      dateTime: [],
      showRecordDg: false, //协商记录弹窗
      expressDialog: false, //物流弹窗
      recordsDialog: false, //变更记录弹窗
      currOrderId: "", // 当前工单id
      msgDisabled: false, // 禁用输入 message 组件
      total: 0, //总条数
      company_name: "", //搜索企业
      companyList: [], //企业列表
      brand_name: "", //搜索品牌
      brandList: [], //品牌列表
      production_name: "", //搜索商品
      productionList: [], //商品列表
      teamList: [], //战队列表
      s_team_name: "", //搜索战队
      search: {
        order_id: "",
        cp_id: "",
        sponsor_id: "",
        team_id: "",
        brand_id: "",
        campaign_id: "",
        production_id: "",
        status: "",
        deadline: {
          start_time: 0,
          end_time: 0
        },
        page_id: 1,
        page_size: 10
      },
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
      list: [],
      express: {
        express_company: "",
        express_number: "",
        express_info: []
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    s_team_name(val) {
      if (val == "") {
        this.search.team_id = "";
        this.searchBtnClick();
      }
    },
    company_name(val) {
      if (val == "") {
        this.search.sponsor_id = "";
        this.searchBtnClick();
      }
    },
    brand_name(val) {
      if (val == "") {
        this.search.brand_id = "";
        this.searchBtnClick();
      }
    },
    production_name(val) {
      if (val == "") {
        this.search.production_id = "";
        this.searchBtnClick();
      }
    },
    dateTime(val) {
      if (!val) {
        this.search.deadline.start_time = 0;
        this.search.deadline.end_time = 0;
      } else {
        this.search.deadline.start_time = moment(val[0]).unix();
        this.search.deadline.end_time = moment(val[1]).unix();
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    handleSelectOne(item) {
      this.search.sponsor_id = item.sponsor_id;
      this.searchBtnClick();
    },
    handleSelectTwo(item) {
      this.search.brand_id = item.brand_id;
      this.searchBtnClick();
    },
    handleSelectThree(item) {
      this.search.production_id = item.production_id;
      this.searchBtnClick();
    },
    handleSelectFour(item) {
      this.search.team_id = item.team_id;
      this.searchBtnClick();
    },
    //筛选战队
    async filterTeam(queryString, cb) {
      if (queryString === "") {
        cb([]);
        return false;
      }
      let req = {
        team_name: queryString
      };
      let res = await this.$api.getTeamName(req);
      if (res.error_code == 0) {
        this.teamList = res.data.list || [];
        for (let i = 0; i < this.teamList.length; i++) {
          this.teamList[i].value = this.teamList[i].team_name;
        }
      } else {
        this.teamList = [];
      }
      cb(this.teamList);
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
    //筛选品牌
    async filterBrand(string, cb) {
      if (!string) {
        cb([]);
        return false;
      }
      let req = this.$initReq({
        brand_name: string
      });
      let res = await this.$api.brandAuthSearch(req);
      if (res.error_code == 0) {
        let brandList = res.data.brands || [];
        for (let i = 0; i < brandList.length; i++) {
          brandList[i]["value"] = brandList[i].brand_name;
        }
        cb(brandList);
      } else {
        cb([]);
      }
    },
    //筛选商品
    async filterProduction(queryString, cb) {
      if (queryString === "") {
        cb([]);
        return false;
      }
      let req = {
        page_id: 1,
        page_size: 20,
        production_name: queryString
      };
      let res = await this.$api.productionSearch(req);
      if (res.error_code == 0) {
        this.productionList = res.data.list || [];
        for (let i = 0; i < this.productionList.length; i++) {
          this.productionList[i].value = this.productionList[i].production_name;
        }
      } else {
        this.productionList = [];
      }
      cb(this.productionList);
    },
    async queryList() {
      let res = await this.$api.getCustomizedOrderList(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        this.list = res.data.orders || [];
        this.total = res.data.count;
      }
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //协商记录
    recordClick(data) {
      this.currOrderId = data.order_id || "";
      this.showRecordDg = true;
    },
    //查看物流
    async expressBtnClick(item) {
      const res = await this.$api.getOrderExpress({
        order_id: item.order_id
      });
      if (res.error_code == 0) {
        this.express = {
          express_company: res.data.express_company,
          express_number: res.data.express_number,
          express_info: res.data.express_info || []
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
    //变更记录
    async recordBtnClick(item) {
      let res = await this.$api.customOrderHistory({ order_id: item.order_id });
      if (res.error_code == 0) {
        this.records = Object.keys(res.data).length !== 0 ? res.data : [];
        this.recordsDialog = true;
      } else {
        this.records = null;
      }
    },
    //关闭订单
    closeBtnClick(data) {
      this.$confirm("确认关闭该订单?", "提示", {
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.closeCustomizedOrder({
            order_id: data.order_id
          });
          if (res.error_code == 0) {
            this.reasonDg = false;
            this.searchBtnClick();
          }
        })
        .catch(async () => {
          this.reasonDg = false;
        });
    },
    querySearchAsync() {},
    reset() {
      this.company_name = "";
      this.brand_name = "";
      this.production_name = ""; //搜索商品
      this.dateTime = [];
      this.search = {
        order_id: "",
        cp_id: "",
        sponsor_id: "",
        team_id: "",
        brand_id: "",
        campaign_id: "",
        production_id: "",
        status: "",
        deadline: {
          start_time: 0,
          end_time: 0
        },
        page_id: 1,
        page_size: 10
      };
      this.queryList();
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryList();
    }
  }
};
</script>

<style scoped></style>
