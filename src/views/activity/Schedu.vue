<template>
  <div class="page-schedu">
    <!--top-->
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.campaign_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动ID"
          maxlength="19"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.campaign_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.brand_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="品牌"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="所属公司"
          v-model.trim="search.company_name"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          class="search-time"
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="活动开始日期"
          end-placeholder="活动开始日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option label="全部状态" value="-1"></el-option>
          <el-option label="待排期" value="101"></el-option>
          <el-option label="未开始" value="4"></el-option>
          <el-option label="报名中" value="0"></el-option>
          <el-option label="已结束" value="1"></el-option>
          <el-option label="名额已用完" value="2"></el-option>
          <el-option label="已拒绝" value="102"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.activity_type"
          @change="searchBtnClick"
        >
          <el-option label="全部活动" :value="0"></el-option>
          <el-option label="试用活动" :value="1"></el-option>
          <el-option label="折扣活动" :value="2"></el-option>
          <el-option label="达人探店" :value="3"></el-option>
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
        <bd-select
          class="search-inp"
          @change="searchBtnClick"
          style="width: 140px;"
          v-model="search.bd_admin_id"
          isAll
        ></bd-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          class="search-time"
          v-model="applyDate"
          type="daterange"
          align="right"
          start-placeholder="申请开始日期"
          end-placeholder="申请截止日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.sort_type"
          @change="searchBtnClick"
          placeholder="排序类型"
        >
          <el-option :value="1" label="活动时间降序"></el-option>
          <el-option :value="2" label="申请时间降序"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchBtnClick"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-form inline>
      <el-form-item label="活动数量:">
        <p class="txt-blue">{{ activity_count }}</p>
      </el-form-item>
      <el-form-item label="分级:">
        <template v-if="grade_list">
          <span
            class="txt-blue"
            v-for="(item, index) in grade_list"
            :key="index"
          >
            <span>{{ item.grade_name }}</span>
            <span>
              {{ item.num }}
              <span v-if="index < grade_list.length - 1">|</span>
            </span>
          </span>
        </template>
        <span v-if="!grade_list" class="txt-blue">0</span>
      </el-form-item>
      <el-form-item label="类目:">
        <template v-if="category_list">
          <span
            class="txt-blue"
            v-for="(item, index) in category_list"
            :key="index"
          >
            <span>{{ item.category_name }}</span>
            <span>
              {{ item.num }}
              <span v-if="index < category_list.length - 1">、</span>
            </span>
          </span>
        </template>
        <span v-if="!category_list" class="txt-blue">0</span>
      </el-form-item>
      <el-form-item v-if="showTimePlafon" style="float: right; color: red"
        >最多统计3个月数据</el-form-item
      >
    </el-form>
    <!--/top-->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="活动Id"
        prop="campaign_id"
        width="100"
      ></el-table-column>
      <el-table-column
        label="活动名称"
        prop="campaign_name"
        min-width="200"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        prop="production_name"
        min-width="150"
      ></el-table-column>
      <el-table-column label="活动类型">
        <template slot-scope="scope">
          <span v-if="scope.row.activity_type == 1">试用活动</span>
          <span v-if="scope.row.activity_type == 2">折扣活动</span>
          <span v-if="scope.row.activity_type == 3">探店活动</span>
        </template>
      </el-table-column>
      <el-table-column label="合作模式">
        <template slot-scope="scope">{{
          coopList[scope.row.package] || "-"
        }}</template>
      </el-table-column>
      <el-table-column
        label="品牌"
        width="100"
        prop="brand_name"
      ></el-table-column>
      <el-table-column
        label="所属公司"
        width="200"
        prop="company_name"
      ></el-table-column>
      <el-table-column label="活动时间" width="150">
        <template slot-scope="scope">
          <div>
            {{ moment(scope.row.start_time * 1000).format("YYYY-MM-DD") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动名额" prop="campaign_quota"></el-table-column>
      <el-table-column label="冻结费用" prop="freeze_point">
        <template slot-scope="scope">
          {{ scope.row.freeze_point / 100 }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="100">
        <template slot-scope="scope">
          <div>
            <p v-if="scope.row.status == '101'">待排期</p>
            <p v-if="scope.row.status == '102'">已拒绝</p>
            <p v-if="scope.row.status == '1'">
              已结束
            </p>
            <p v-if="scope.row.status == '2'">
              名额已用完
            </p>
            <p v-if="scope.row.status == '4'">未开始</p>
            <p v-if="scope.row.status == '0'">报名中</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="BD负责人">
        <template slot-scope="scope">{{
          allAdmin[scope.row.bd_admin_id]
        }}</template>
      </el-table-column>
      <el-table-column label="运营负责人">
        <template slot-scope="scope">{{
          allAdmin[scope.row.admin_id]
        }}</template>
      </el-table-column>
      <!-- 空标题 用来存放删除的理由（如果有的话） -->
      <el-table-column label prop="refuse_reason">
        <template slot-scope="scope">
          <p v-if="scope.row.status == '102'">{{ scope.row.refuse_reason }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="申请时间"
        prop="apply_time"
        width="150"
        fixed="right"
      >
        <template slot-scope="scope">
          {{
            moment(scope.row.apply_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <div>
            <preview-button
              :activityData="scope.row"
              class="btn"
              v-if="scope.row.status != 102"
            ></preview-button>
            <detail-button
              :activityData="scope.row"
              class="btn"
              @updateList="getScheduleList"
            ></detail-button>
            <el-button
              v-if="scope.row.status == '101'"
              @click="adoptBtnClick(scope.row)"
              type="text"
              >通过</el-button
            >
            <el-button
              v-if="scope.row.status == '101'"
              @click="start(scope.row)"
              type="text"
              >拒绝</el-button
            >
            <el-button
              v-if="scope.row.status == 4 || scope.row.status == 0"
              type="text"
              @click="closeAcivity(scope.row)"
              >关闭活动</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--page-->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        layout="total,prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page_id"
        :page-size="10"
        :total="count"
      ></el-pagination>
    </div>
    <!--/page-->

    <!-- 拒绝dg -->
    <el-dialog
      title="拒绝理由"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @open="reset"
    >
      <el-input
        v-model.trim="refuseReason"
        placeholder="请输入拒绝认证的理由"
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
import moment from "moment";
import AdminSelect from "../../components/AdminSelect";
import BdSelect from "../../components/BdSelect";
import DetailButton from "./components/DetailButton";
import PreviewButton from "./components/PreviewButton";
export default {
  components: {
    AdminSelect,
    BdSelect, //BD
    DetailButton,
    PreviewButton
  },
  data() {
    return {
      coopList: {
        1: "自定义悬赏",
        2: "免费置换",
        3: "基础套餐",
        4: "标准套餐",
        5: "高级套餐"
      },
      setId: "",
      refuseReason: "",
      dialogVisible: false,
      rules: {
        production_specs: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个规格",
            trigger: "change"
          }
        ]
      },
      date: "",
      moment: moment,
      search: {
        campaign_id: "",
        campaign_name: "",
        brand_name: "",
        begin_time: 0,
        end_time: 0,
        page_id: 1,
        page_size: 10, //每页10条
        status: "101",
        admin_id: "0", //负责人id
        activity_type: 0, // 活动类型
        company_name: "", // 公司名
        bd_admin_id: "0", //BD id
        sort_type: 1, // 排序类型
        apply_begin: 0,
        apply_end: 0 // 申请时间 筛选
      },
      list: [],
      count: 0,
      activity_count: "", // 活动数量
      grade_list: [], // 分级列表
      category_list: [], // 类目列表
      showTimePlafon: false, // 时间上限 3个月
      specChangeDg: false, // 更改规格dg
      specChangeData: {}, // 规格更改数据对象
      changeSpecDisable: false,
      sepcTitle: "", // 规格标题

      specslist: [], //获取商品规格的列表
      // production_id: "",
      applyDate: {} // 申请时间筛选对象
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    },
    startTimeOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000;
        }
      };
    },
    endTimeOptions() {
      let start_time = new Date(this.activity.start_time).getTime();
      return {
        disabledDate(time) {
          return time.getTime() < start_time;
        }
      };
    },

    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  watch: {
    applyDate(val) {
      //清除时间会导致val 变成 null
      if (!val) {
        this.search.apply_begin = 0;
        this.search.apply_end = 0;
      } else {
        this.search.apply_begin = moment(val[0]).unix();
        this.search.apply_end = moment(val[1]).unix();
      }
      //刷新列表
      this.searchBtnClick();
    },
    date(val) {
      if (val == null) {
        this.search.begin_time = 0;
        this.search.end_time = 0;
      } else {
        this.search.begin_time = moment(val[0]).unix();
        this.search.end_time = moment(val[1]).unix();
        let threeMonthTime = 3 * 30 * 24 * 60 * 60;
        if (this.search.end_time - this.search.begin_time > threeMonthTime) {
          this.showTimePlafon = true;
        } else {
          this.showTimePlafon = false;
        }
      }
      this.searchBtnClick();
    }
  },
  mounted() {
    this.searchBtnClick();
  },
  methods: {
    start(item) {
      this.setId = item;
      this.dialogVisible = true;
    },
    reset() {
      this.refuseReason = "";
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.getScheduleList();
    },
    //获取排期列表
    async getScheduleList() {
      let res = await this.$api.scheduleList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.activity_count = res.data.activity_count; // 活动数
        this.grade_list = res.data.grade_list; // 分级
        this.category_list = res.data.category_list; // 类目
        this.count = res.data.count;
      }
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.getScheduleList();
    },
    //通过
    async adoptBtnClick(item) {
      this.$confirm("确定通过该活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let req = {
          campaign_id: item.campaign_id,
          status: 0 //正常状态
        };
        let res = await this.$api.scheduleAudit(req);
        if (res.error_code == 0) {
          this.$message.success(`审核成功,当日活动数${res.data.count || 0}`);
          this.getScheduleList();
        } else {
          if (res.error_code == 2000) {
            this.$message.error("客户账号余额不足,请联系客户充值");
          }
        }
      });
    },
    //拒绝
    async refuseBtnClick(item, message) {
      this.dialogVisible = false;
      if (message != "") {
        let req = {
          campaign_id: item.campaign_id,
          status: 102,
          refuse_reason: message //携带拒绝的信息
        };
        let res = await this.$api.scheduleAudit(req);
        if (res.error_code == 0) {
          this.$message.info("拒绝成功");
          this.getScheduleList();
        }
      } else {
        this.dialogVisible = true;
        this.$message.warning("请输入拒绝理由");
      }
    },

    //关闭活动
    closeAcivity(item) {
      this.$confirm("确定关闭该活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let req = {
          campaign_id: item.campaign_id
          // status: 1 //关闭状态 不需要
        };
        let res = await this.$api.campaignClose(req);
        if (res.error_code == 0) {
          this.$message.success("关闭成功");
          this.getScheduleList();
        }
      });
    }
  }
};
</script>
<style lang="less">
.btn {
  display: inline-block;
  margin-right: 8px;
}
.page-schedu {
  .pagination {
    padding: 30px 0;
    text-align: center;
  }
}

.txt-blue {
  color: #2f89ff;
  font-size: 14px;
}
.info-title {
  color: #aeaeae;
  font-size: 16px;
  padding-left: 0px;
  line-height: 50px;
  text-align: left;
  border-top: 1px solid #e6e6e6;
}
</style>
