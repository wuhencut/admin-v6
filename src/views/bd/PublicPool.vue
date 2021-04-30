<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.sponsor_id"
          placeholder="客户id"
          @keyup.enter.native="searchBtnClick"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.company_name"
          placeholder="企业名称"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          placeholder="品牌名称"
          class="search-inp"
          v-model="brandInfo.brand_name"
          :fetch-suggestions="searchBrand"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.phone"
          placeholder="联系电话"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.contact_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="联系人"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <bd-select
          isAll
          isNew
          class="search-inp"
          v-model="search.bd_admin_id"
          @change="searchBtnClick"
        ></bd-select>
      </el-form-item>
      <el-form-item>
        <admin-select
          isNew
          isAll
          class="search-inp"
          @change="searchBtnClick"
          v-model="search.operator_admin_id"
        ></admin-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.sponsor_level"
          @change="searchBtnClick"
        >
          <el-option value label="商户等级"></el-option>
          <el-option value="KA" label="KA"></el-option>
          <el-option value="A" label="A"></el-option>
          <el-option value="B" label="B"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.account_pool_status"
          @change="searchBtnClick"
        >
          <el-option value label="账号状态"></el-option>
          <el-option :value="1" label="正常"></el-option>
          <el-option :value="4" label="冻结中"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.auth_status"
          @change="searchBtnClick"
        >
          <el-option value label="认证状态"></el-option>
          <el-option :value="1" label="未提交"></el-option>
          <el-option :value="2" label="待审核"></el-option>
          <el-option :value="3" label="已拒绝"></el-option>
          <el-option :value="4" label="已通过"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.housekeeper_status"
          @change="searchBtnClick"
        >
          <el-option value label="管家状态"></el-option>
          <el-option :value="1" label="已开始"></el-option>
          <el-option :value="2" label="未开始"></el-option>
          <el-option :value="3" label="未开启"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.sort"
          @change="searchBtnClick"
        >
          <el-option value label="默认排序"></el-option>
          <el-option :value="1" label="信用分从低到高"></el-option>
          <el-option :value="2" label="积分从高到低"></el-option>
          <el-option :value="3" label="可用余额从高到低"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          :picker-options="pickerOptions"
          class="search-time"
          v-model="applyDate"
          type="daterange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker
          class="search-time"
          v-model="settleDate"
          type="daterange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-searc" type="primary" @click="searchBtnClick"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <pool-move
          @update="queryList"
          @menuClick="menuClick"
          @cancelClick="isMove = false"
          :selectedList="selectedList"
          :btnTxt="btnTxt"
          :isCharge="isCharge"
          v-if="authList.indexOf('1603862488') > -1"
        ></pool-move>
      </el-form-item>
    </el-form>

    <el-table ref="table" :data="list" @selection-change="selectClick">
      <el-table-column
        v-if="isMove"
        :selectable="canSelect"
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="企业名称 | 客户ID" width="155">
        <template slot-scope="scope">
          <p>{{ scope.row.company_name || "-" }}</p>
          <p>{{ scope.row.sponsor_id || "-" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="授权品牌" prop="brand_name" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.auth_brand && scope.row.auth_brand.length > 0">
            <span
              class="tag"
              v-for="(item, index) in scope.row.auth_brand"
              :key="index"
              >{{ item }}
            </span>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="客户池">
        <template slot-scope="scope">
          {{ pools[scope.row.pool_type] }}
        </template>
      </el-table-column>
      <el-table-column label="商户等级" prop="sponsor_level"></el-table-column>
      <el-table-column label="认证状态" width="100">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.auth_status == 1" type="warning"
              >未提交</el-tag
            >
            <el-tag v-if="scope.row.auth_status == 2">待审核</el-tag>
            <el-tag type="danger" v-if="scope.row.auth_status == 5"
              >已冻结</el-tag
            >
            <el-tag type="success" v-if="scope.row.auth_status == 4"
              >已通过</el-tag
            >
            <el-tag type="danger" v-if="scope.row.auth_status == 3"
              >已拒绝</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="BD负责人">
        <template slot-scope="scope">
          {{ allAdmin[scope.row.bd_admin_id] || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="运营负责人">
        <template slot-scope="scope">
          {{ allAdmin[scope.row.operator_admin_id] || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="95">
        <template slot-scope="scope">
          {{
            scope.row.apply_time > 0
              ? moment(scope.row.apply_time * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "-"
          }}
        </template>
      </el-table-column>
      <el-table-column label="入驻通过时间" width="95">
        <template slot-scope="scope">
          {{
            scope.row.enter_time > 0
              ? moment(scope.row.enter_time * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              : "-"
          }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          {{ statusList[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <div>
            <detail
              @refresh="queryList"
              class="btn"
              :sponsor="scope.row"
            ></detail>
            <remark
              v-if="authList.indexOf('1601373252') > -1"
              class="btn"
              :sponsor_id="scope.row.sponsor_id"
            ></remark>
            <freeze
              @update="queryList"
              class="btn"
              :sponsor="scope.row"
              v-if="authList.indexOf('1601373242') > -1"
            ></freeze>
          </div>
          <new-auth
            v-if="authList.indexOf('1601373261') > -1"
            :sponsor_id="scope.row.sponsor_id"
            class="btn"
          ></new-auth>
          <new-cert
            v-if="
              authList.indexOf('1601373275') > -1 && scope.row.auth_status == 1
            "
            class="btn"
            :sponsor_id="scope.row.sponsor_id"
            @refresh="queryList"
          ></new-cert>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination" v-show="list.length > 0">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        :current-page="search.page_id"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import NewCert from "./components/NewCert";
import BdSelect from "../../components/BdSelect";
import AdminSelect from "../../components/AdminSelect";
import PoolMove from "./components/PoolMove";
import NewAuth from "./components/NewAuth";
import Freeze from "./components/Freeze";
import Remark from "./components/Remark";
import Detail from "./components/Detail";
import moment from "moment";
import getUserInfo from "../../api/getUserInfo";
export default {
  name: "personalPool",
  components: {
    BdSelect,
    AdminSelect,
    Detail,
    Remark,
    Freeze,
    NewAuth,
    PoolMove,
    NewCert
  },
  data() {
    return {
      inCharge: false, // 是否是主管
      pickerOptions: {},
      btnTxt: "拾取",
      // 品牌搜索得到的信息
      brandInfo: {
        brand_name: "",
        brand_id: ""
      },
      pools: ["", "个人私有池", "个人发展池", "公司公海"],
      poolStatusList: [
        "",
        "private_pool_status",
        "develop_pool_status",
        "public_pool_status"
      ],
      isMove: false, // 点击转移
      authStatus: ["未提交", "待审核", "已拒绝", "已通过"],
      statusList: [
        "账号状态",
        "正常-可转移",
        "正常-限制转移",
        "正常-不可转移",
        "冻结中"
      ],
      moment: moment,
      targetPool: "", // 想要转移的目标池
      list: [],
      total: 100,
      applyDate: {}, // 申请时间
      settleDate: {}, // 入驻时间
      search: {
        auth_status: "", // 认证状态
        pool_type: 3, // 1:私有池 2:发展池 3:公海池
        bd_admin_id: "", //BD
        sponsor_id: "", //客户id
        company_name: "", //企业名称
        brand_id: "", //品牌名称
        phone: "", //联系电话
        contact_name: "", //联系人
        sponsor_level: "", //商户等级: KA A B
        account_pool_status: "", // 商户账号池状态
        housekeeper_status: "", // 管家状态 1已开始 2 未开始
        sort: "", //排序：1 信用分排序 2 积分排序 3 可用余额排序
        operator_admin_id: "", //运营负责
        apply_start_time: "",
        apply_end_time: "",
        enter_start_time: "",
        enter_end_time: "",
        page_id: 1,
        page_size: 10,
        supervisor: false
      },
      selectedList: [], // 勾选后的列表
      isCharge: false, // 是否主管
      userInfo: getUserInfo()
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    applyDate(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.apply_start_time = 0;
        this.search.apply_end_time = 0;
      } else {
        this.search.apply_start_time = moment(val[0]).unix();
        this.search.apply_end_time = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    },
    settleDate(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.enter_start_time = 0;
        this.search.enter_end_time = 0;
      } else {
        this.search.enter_start_time = moment(val[0]).unix();
        this.search.enter_end_time = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    }
  },
  created() {
    if (this.authList.indexOf("1601372533") > -1) {
      this.btnTxt = "分配";
      this.isCharge = true;
    }
    this.queryList();
  },
  methods: {
    // 点击选择偏僻
    handleSelect(val) {
      this.brandInfo = {
        brand_name: val.brand_name,
        brand_id: val.brand_id
      };
      this.queryList();
    },
    // 品牌搜索
    async searchBrand(string, cb) {
      if (!string) {
        cb([]);
        this.brandInfo.brand_id = "";
        return false;
      }
      let req = this.$initReq({
        sponsor_id: "",
        brand_name: string
      });
      let res = await this.$api.brandAuthSearch(req);
      if (res.error_code == 0) {
        let brandList = res.data.brands || [];
        if (brandList.length == 0) {
          this.$message.error("不存在您搜索的品牌");
          this.brandInfo = { brand_name: "", brand_id: "" };
        } else {
          for (let i = 0; i < brandList.length; i++) {
            brandList[i]["value"] = brandList[i].brand_name;
          }
        }
        cb(brandList);
      } else {
        cb([]);
      }
    },
    // 判断是否可转移
    canSelect(row) {
      // 1 可转移
      if (this.authList.indexOf("1601372533") > -1) {
        // 主管除了冻结，都可转
        return (
          row[this.poolStatusList[this.targetPool]] != 4 && row.auth_status == 4
        );
      } else {
        return row[this.poolStatusList[this.targetPool]] == 1;
      }
    },
    menuClick(val) {
      this.$refs.table.clearSelection();
      this.isMove = true;
      this.targetPool = val;
    },
    // 检测列表选择的list变化
    selectClick(list) {
      this.selectedList = list;
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async queryList() {
      this.search.supervisor = this.isCharge;
      this.search.brand_id = this.brandInfo.brand_id;
      let res = await this.$api.getPoolList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    reset() {
      this.settleDate = null;
      this.applyDate = null;
      this.brandInfo = {
        brand_name: "",
        brand_id: ""
      };
      this.search = {
        pool_type: 3, // 1:私有池 2:发展池 3:公海池
        bd_admin_id: "", //BD
        sponsor_id: "", //客户id
        company_name: "", //企业名称
        brand_id: "", //品牌名称
        phone: "", //联系电话
        contact_name: "", //联系人
        sponsor_level: "", //商户等级: KA A B
        account_pool_status: "", // 商户账号状态
        housekeeper_status: "", // 管家状态 1已开始 2 未开始
        sort: "", //排序：1 信用分排序 2 积分排序 3 可用余额排序
        operator_admin_id: "", //运营负责
        apply_start_time: "",
        apply_end_time: "",
        enter_start_time: "",
        enter_end_time: "",
        page_id: 1,
        page_size: 10
      };
      this.queryList();
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  .tag {
    margin-right: 6px;
    margin-bottom: 6px;
    padding: 0 8px;
    background-color: #ecf5ff;
    border: 1px solid #d9ecff;
    font-size: 12px;
    color: #409eff;
    border-radius: 4px;
    display: inline-block;
    box-sizing: border-box;
  }
  .search-time {
    width: 250px;
  }
  .btn {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
