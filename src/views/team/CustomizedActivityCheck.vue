<template>
  <div class="customized-activity">
    <div class="header">
      <el-form inline>
        <el-form-item>
          <el-input
            placeholder="活动ID"
            class="search-inp"
            v-model.trim="search.campaign_id"
            maxlength="19"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="活动名称"
            class="search-inp"
            v-model.trim="search.campaign_name"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            class="search-inp"
            :fetch-suggestions="filterProduction"
            placeholder="商品名称"
            @select="handleSelectOne"
            v-model.trim="production_name"
            style="width:300px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            v-model.trim="company_name"
            :fetch-suggestions="filterCompany"
            placeholder="商家名称"
            @select="handleSelectTwo"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-select
            class="search-inp"
            v-model="search.status"
            @change="searchBtnClick"
          >
            <el-option value label="全部审核状态"></el-option>
            <el-option :value="200" label="待审核"></el-option>
            <el-option :value="300" label="报名中"></el-option>
            <el-option :value="500" label="提名中"></el-option>
            <el-option :value="400" label="已拒绝"></el-option>
            <el-option :value="501" label="活动关闭"></el-option>
            <el-option :value="502" label="活动结束"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <bd-select
            class="search-inp"
            v-model="search.bd_id"
            @change="searchBtnClick"
            isAll
          ></bd-select>
        </el-form-item>
        <el-form-item>
          <admin-select
            class="search-inp"
            isAll
            v-model="search.operator_id"
            @change="searchBtnClick"
          ></admin-select>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="searchBtnClick"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh-right" @click="clear"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- list -->
    <div class="list">
      <el-table :data="list">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="活动ID" prop="campaign_id"></el-table-column>
        <el-table-column
          label="活动名称"
          prop="campaign_name"
        ></el-table-column>
        <el-table-column
          label="商品名称"
          prop="production_name"
        ></el-table-column>
        <el-table-column label="所属公司" prop="company_name"></el-table-column>
        <el-table-column label="活动预算" prop="budget">
          <template slot-scope="scope">
            <p>{{ scope.row.budget / 100 }}</p>
          </template>
        </el-table-column>
        <el-table-column label="活动名额" prop="total_num"></el-table-column>
        <el-table-column label="审核状态" prop="status">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 500">提名中</p>
            <p v-if="scope.row.status == 200">待审核</p>
            <p v-if="scope.row.status == 300">报名中</p>
            <p v-if="scope.row.status == 400">已拒绝</p>
            <p v-if="scope.row.status == 501">活动关闭</p>
            <p v-if="scope.row.status == 502">活动结束</p>
          </template>
        </el-table-column>
        <el-table-column label="BD负责人">
          <template slot-scope="scope">
            <p>{{ allAdim[scope.row.bd_id] }}</p>
          </template>
        </el-table-column>
        <el-table-column label="运营负责人">
          <template slot-scope="scope">
            <p>{{ allAdim[scope.row.operator_id] }}</p>
          </template>
        </el-table-column>
        <el-table-column label="提交审核时间" min-width="100px">
          <template slot-scope="scope">
            <p>
              {{
                moment(scope.row.review_time * 1000).format("YYYY-MM-DD HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150px">
          <template slot-scope="scope">
            <check-detail
              class="btn"
              :campaign="scope.row"
              style="display:inline-block"
              @recall="queryList"
              v-if="authList.indexOf('id1611715024') > -1"
              >查看</check-detail
            >
            <el-button
              type="text"
              v-if="
                scope.row.status == 200 && authList.indexOf('id1611715042') > -1
              "
              @click="passAcivity(scope.row)"
            >
              通过
            </el-button>
            <el-button
              type="text"
              v-if="
                scope.row.status == 200 && authList.indexOf('id1611715042') > -1
              "
              @click="refuse(scope.row)"
              >拒绝</el-button
            >
            <el-button
              type="text"
              v-if="
                authList.indexOf('id1611715105') > -1 &&
                  (scope.row.status == 300 || scope.row.status == 500)
              "
              @click="closeAcivity(scope.row)"
              >关闭活动</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-if="total !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 通过dg -->
    <el-dialog :visible.sync="passDg" width="300px">
      <span>确定通过该活动？</span>
      <p>
        通过后该活动将对定制博主开放报名！
        审核通过后将冻结商家预算，请确保商户账户余额充足
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passDg = false">取 消</el-button>
        <el-button type="primary" @click="passBtnClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 通过Dg -->
    <!-- 拒绝dg -->
    <el-dialog
      title="拒绝理由"
      :visible.sync="refuseDg"
      width="500px"
      :close-on-click-modal="false"
      @open="reset"
    >
      <el-input
        v-model.trim="refuseReason"
        placeholder="请输入拒绝的理由"
        type="textarea"
        rows="5"
        maxlength="50"
        show-word-limit
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="refuseBtnClick(setId, refuseReason)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 拒绝dg -->
  </div>
</template>
<script>
import BdSelect from "../../components/BdSelect";
import AdminSelect from "../../components/AdminSelect";
import CheckDetail from "../../views/team/components/checkDetail";
import moment from "moment";
export default {
  components: {
    BdSelect,
    AdminSelect,
    CheckDetail
  },
  data() {
    return {
      moment: moment,
      refuseDg: false,
      passDg: false,
      production_name: "",
      company_name: "",
      productionList: [],
      companyList: [],
      search: {
        campaign_id: "",
        campaign_name: "",
        production_id: "0",
        company_id: "",
        bd_id: "0",
        operator_id: "0",
        status: "",
        page_id: 1,
        page_size: 10
      },
      info: {},
      refuseReason: "",
      total: 0, //总条数
      list: []
    };
  },
  computed: {
    allAdim() {
      return this.$store.getters.getAllAdmin;
    },
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    production_name(val) {
      if (val == "") {
        this.search.production_id = "";
        this.searchBtnClick();
      }
    },
    company_name(val) {
      if (val == "") {
        this.search.sponsor_id = "";
        this.searchBtnClick();
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
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
    handleSelectOne(item) {
      this.search.production_id = item.production_id;
      this.searchBtnClick();
    },
    handleSelectTwo(item) {
      this.search.sponsor_id = item.sponsor_id;
      this.searchBtnClick();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      let res = await this.$api.getCustomActivityList(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.total = res.data.count;
      }
    },
    //重置
    clear() {
      this.company_name = "";
      this.production_name = "";
      this.search = {
        campaign_id: "",
        campaign_name: "",
        production_id: "0",
        company_id: "",
        bd_id: "0",
        operator_id: "0",
        status: "",
        page_id: 1,
        page_size: 10
      };
      this.queryList();
    },
    //通过活动
    passAcivity(item) {
      this.info = item;
      this.passDg = true;
    },
    //确认通过活动
    async passBtnClick() {
      let req = {
        campaign_id: this.info.campaign_id,
        status: 300,
        refuse_reason: ""
      };
      let res = await this.$api.auditActivity(req);
      if (res.error_code == 0) {
        this.$message.success("操作成功！");
        this.queryList();
      }
      this.passDg = false;
    },
    //关闭活动
    closeAcivity(item) {
      this.$confirm("确定关闭该活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let req = {
          campaign_id: item.campaign_id,
          status: 501,
          refuse_reason: ""
        };
        let res = await this.$api.auditActivity(req);
        if (res.error_code == 0) {
          this.$message.success("关闭成功");
          this.queryList();
        }
      });
    },
    //拒绝活动
    refuse(item) {
      this.setId = item;
      this.refuseDg = true;
    },
    reset() {
      this.refuseReason = "";
    },
    //拒绝
    async refuseBtnClick(item, message) {
      this.refuseDg = false;
      if (message != "") {
        let req = {
          campaign_id: item.campaign_id,
          status: 400,
          refuse_reason: message //携带拒绝的信息
        };
        let res = await this.$api.auditActivity(req);
        if (res.error_code == 0) {
          this.$message.success("拒绝成功");
          this.queryList();
        }
      } else {
        this.refuseDg = true;
        this.$message.warning("请输入拒绝理由");
      }
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryList();
    }
  }
};
</script>
<style lang="less" scoped>
.btn {
  display: inline-block;
  margin-right: 10px;
}
</style>
