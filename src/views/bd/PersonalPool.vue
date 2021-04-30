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
          v-if="authList.indexOf('1601263102') > -1"
          isAll
          isNew
          class="search-inp"
          v-model="search.bd_admin_id"
          @change="searchBtnClick"
        ></bd-select>
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
          <el-option value label="所有账号状态"></el-option>
          <el-option :value="1" label="正常"></el-option>
          <el-option :value="2" label="FT"></el-option>
          <el-option :value="3" label="私有池移出限制"></el-option>
          <el-option :value="4" label="冻结中"></el-option>
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
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.pool_type"
          @change="searchBtnClick"
        >
          <el-option :value="1" label="个人私有池"></el-option>
          <el-option :value="2" label="个人发展池"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <admin-select
          v-model="search.operator_admin_id"
          class="search-inp"
          @change="searchBtnClick"
          isAll
          isNew
        ></admin-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
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
          btnTxt="转移"
          :isCharge="search.supervisor"
          v-if="authList.indexOf('1603863830') > -1"
        ></pool-move>
      </el-form-item>
      <el-form-item
        v-if="authList.indexOf('1606897835') > -1"
        style="float: right; padding-right: 20px;"
      >
        <el-badge :value="ftTotal" class="item" :hidden="ftTotal == 0">
          <el-button @click="ftHelperClick">FT客户助手</el-button>
        </el-badge>
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
      <el-table-column label="授权品牌" min-width="150" prop="brand_name">
        <template slot-scope="scope">
          <div v-if="scope.row.auth_brand && scope.row.auth_brand.length > 0">
            <span
              class="tag"
              v-for="(item, index) in scope.row.auth_brand"
              :key="index"
              >{{ item }}</span
            >
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
              v-if="authList.indexOf('1601275359') > -1"
              class="btn"
              :sponsor_id="scope.row.sponsor_id"
            ></remark>
            <freeze
              @update="queryList"
              class="btn"
              :sponsor="scope.row"
              v-if="authList.indexOf('1601275334') > -1"
            ></freeze>
          </div>
          <new-auth
            v-if="authList.indexOf('1601373148') > -1"
            :sponsor_id="scope.row.sponsor_id"
            class="btn"
          ></new-auth>
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

    <el-dialog
      append-to-body
      :visible.sync="dialog"
      title="FT客户助手"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-table :data="ftList">
        <el-table-column label="FT客户" prop="campany_name">
          <template slot-scope="scope">
            <p>{{ scope.row.company_name }}</p>
            <p>{{ scope.row.sponsor_id }}</p>
          </template>
        </el-table-column>
        <el-table-column label="剩余时长" prop="ft_remain_days">
          <template slot-scope="scope">
            {{ scope.row.ft_remain_days }}天
          </template>
        </el-table-column>
        <el-table-column label="BD负责人" prop="bd_admin_id">
          <template slot-scope="scope">
            {{ allAdmin[scope.row.bd_admin_id] }}
          </template>
        </el-table-column>
        <el-table-column label="转移至">
          <template slot-scope="scope">
            <el-button @click="moveClick(scope.row, 1)" type="text"
              >私有池</el-button
            >
            <el-button @click="moveClick(scope.row, 2)" type="text"
              >发展池</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="ftTotal"
          @current-change="ftPageChange"
          :current-page="ftSearch.page_id"
          :page-size="ftSearch.page_size"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AdminSelect from "../../components/AdminSelect";
import BdSelect from "../../components/BdSelect";
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
    Detail,
    Remark,
    Freeze,
    NewAuth,
    PoolMove,
    AdminSelect
  },
  data() {
    return {
      // 品牌搜索得到的信息
      brandInfo: {
        brand_name: "",
        brand_id: ""
      }, // 品牌搜索得到的信息
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
      total: 1,
      applyDate: {}, // 申请时间
      settleDate: {}, // 入驻时间
      search: {
        pool_type: 1, // 1:私有池 2:发展池 3:公海池
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
        settle_start_time: "",
        settle_end_time: "",
        page_id: 1,
        page_size: 10,
        supervisor: false
      },
      ftSearch: {
        admin_id: "",
        page_id: 1,
        page_size: 5
      },
      dialog: false,
      ftTotal: 0,
      ftList: [],
      selectedList: [], // 勾选后的列表
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
  created() {
    this.search.supervisor =
      this.authList.indexOf("1601263102") > -1 ? true : false;
    this.getPoolCapacity();
    this.queryList();
    this.getExpiredList();
  },
  watch: {
    "search.pool_type"() {
      this.getPoolCapacity();
    },
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
  methods: {
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
    async moveClick(item, type) {
      let res1 = await this.$api.getPoolCapacity({
        admin_id: item.bd_admin_id
      });
      if (res1.error_code == 0) {
        if (type == 1 && res1.data.private_num >= 200) {
          this.$message.error("私有池容量已超过200");
          return false;
        }
        if (type == 2 && res1.data.develop_num >= 200) {
          this.$message.error("发展池容量已超过200");
          return false;
        }
      }
      this.$confirm(
        `请确保个人${type == 1 ? "私有池" : "发展"}有容量`,
        `是否确定将该客户转移至个人${type == 1 ? "私有池" : "发展"}？`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success"
        }
      )
        .then(async () => {
          let res = await this.$api.movePool({
            target_bd: item.bd_admin_id,
            target_pool: type,
            operator_id: this.userInfo.user_id,
            supervisor: this.search.supervisor,
            list: [
              {
                admin_id: item.bd_admin_id,
                sponsor_id: item.sponsor_id,
                pool_type: item.pool_type
              }
            ]
          });
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.getExpiredList();
          }
        })
        .catch(() => {
          this.dialog = false;
        });
    },
    // ft 按钮 click
    ftHelperClick() {
      this.dialog = true;
      this.getExpiredList();
    },
    // ft助手，获取快要到期的FT商户
    async getExpiredList() {
      // this.ftSearch.bd_admin_id = this.search.bd_admin_id;
      this.ftSearch.admin_id = this.search.bd_admin_id;
      let res = await this.$api.getExpiredFTList(this.$initReq(this.ftSearch));
      if (res.error_code == 0) {
        this.ftList = res.data.list || [];
        this.ftTotal = res.data.count || 0;
      } else {
        this.ftList = [];
      }
    },
    // 判断是否可转移
    canSelect(row) {
      // 1 可转移
      if (this.authList.indexOf("1601263102") > -1) {
        // 主管除了冻结，都可转
        return (
          row[this.poolStatusList[this.targetPool]] != 4 && row.auth_status == 4
        );
      } else {
        return row[this.poolStatusList[this.targetPool]] == 1;
      }
    },
    // 转移 踩点 点击
    menuClick(val) {
      this.$refs.table.clearSelection();
      this.isMove = true;
      this.targetPool = val;
    },
    // 检测列表选择的list变化
    selectClick(list) {
      this.selectedList = list;
    },
    // page_id 1 search
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    // query list
    async queryList() {
      if (this.authList.indexOf("1601263102") < 0) {
        this.search.bd_admin_id = this.userInfo.user_id;
      }
      this.search.brand_id = this.brandInfo.brand_id;
      let res = await this.$api.getPoolList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    // outer page change
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    // ft page change
    ftPageChange(val) {
      this.ftSearch.page_id = val;
      this.getExpiredList();
    },
    // 获取池容量
    async getPoolCapacity() {
      let res = await this.$api.getPoolCapacity({
        admin_id: this.userInfo.user_id
      });
      if (res.error_code == 0) {
        this.poolCapacity = res.data || {
          private_num: 0,
          develop_num: 0
        };
      }
      if (this.search.pool_type == 1 && res.data.private_num > 200) {
        this.$confirm(
          `当前个人私有池${this.poolCapacity.private_num}个,已超容,请及时处理`,
          "超容提醒",
          {
            showConfirmButton: false,
            type: "warning",
            cancelButtonText: "关闭"
          }
        );
      }
      if (this.search.pool_type == 2 && res.data.develop_num > 200) {
        this.$confirm(
          `当前个人发展池${this.poolCapacity.develop_num}个,已超容,请及时处理`,
          "超容提醒",
          {
            showConfirmButton: false,
            type: "warning",
            cancelButtonText: "关闭"
          }
        );
      }
    },
    reset() {
      this.settleDate = null;
      this.applyDate = null;
      this.brandInfo = {
        brand_id: "",
        brand_name: ""
      };
      this.search = {
        pool_type: 1, // 1:私有池 2:发展池 3:公海池
        bd_admin_id: "", //BD
        sponsor_id: "", //客户id
        company_name: "", //企业名称
        brand_id: "", //品牌id
        phone: "", //联系电话
        contact_name: "", //联系人
        sponsor_level: "", //商户等级: KA A B
        account_pool_status: "", // 商户账号状态
        housekeeper_status: "", // 管家状态 1已开始 2 未开始
        sort: "", //排序：1 信用分排序 2 积分排序 3 可用余额排序
        operator_admin_id: "", //运营负责
        apply_start_time: "",
        apply_end_time: "",
        settle_start_time: "",
        settle_end_time: "",
        page_id: 1,
        page_size: 10,
        supervisor: this.search.supervisor
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
