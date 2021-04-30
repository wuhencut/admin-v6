<template>
  <div class="page-reward">
    <el-form inline="">
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="订单编号"
          v-model.trim="search.order_id"
          @keyup.enter.native="searchBtnClick"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="用户昵称"
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="活动名称"
          v-model.trim="search.campaign_name"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option label="全部审核状态" value=""></el-option>
          <el-option label="待审核" value="waiting"></el-option>
          <el-option label="已通过" value="pass"></el-option>
          <el-option label="沟通中" value="communication"></el-option>
          <el-option label="已拒绝" value="refuse"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <bd-select
          class="search-inp"
          v-model="search.bd_admin_id"
          isAll
          isNew
          noBd
          @change="searchBtnClick"
        ></bd-select>
      </el-form-item>
      <el-form-item>
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
    </el-form>

    <!-- list -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="订单编号"
        prop="order_id"
        width="150"
      ></el-table-column>
      <el-table-column label="用户昵称" prop="cp_nickname"></el-table-column>
      <el-table-column label="活动id" prop="campaign_id"></el-table-column>
      <el-table-column
        label="活动名称"
        prop="campaign_name"
        min-width="150"
      ></el-table-column>
      <el-table-column label="所属公司" prop="company_name"></el-table-column>
      <el-table-column label="测评提交时间" prop="review_time" width="150">
        <template slot-scope="scope">
          {{
            moment(scope.row.review_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column label="BD负责人">
        <template slot-scope="scope">
          {{ allAdmin[scope.row.bd_admin_id] }}
        </template>
      </el-table-column>
      <el-table-column label="悬赏状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 'waiting'">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status == 'pass'"
            >已通过</el-tag
          >
          <el-tag type="warning" v-if="scope.row.status == 'communication'"
            >沟通中</el-tag
          >
          <el-tag type="danger" v-if="scope.row.status == 'refuse'"
            >已拒绝</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" fixed="right">
        <template slot-scope="scope">
          <el-button @click="detailClick(scope.row)" type="text"
            >查看</el-button
          >
          <el-button type="text" @click="recordClick(scope.row)"
            >协商记录</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- list -->
    <!--page-->
    <div class="pagination" v-if="total > 0">
      <el-pagination
        background
        layout="total,prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        :total="total"
      ></el-pagination>
    </div>
    <!--/page-->

    <el-dialog title="查看详情" :visible.sync="detailDg" width="850px">
      <order-detail :showAllInfo="false" :order="order"></order-detail>
      <el-form v-if="this.verify_list.length !== 0">
        <el-form-item
          label="审核历史"
          style="font-weight: bold;padding: 10px 0"
        >
          <el-table :data="verify_list" :show-header="false">
            <el-table-column prop="status" width="100px"> </el-table-column>
            <el-table-column
              width="200px"
              prop="operation_content"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                {{
                  moment(scope.row.operation_time * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <p v-if="scope.row.operate_id !== '0'">
                  {{ allAdmin[scope.row.operate_id] }}
                </p>
                <p v-else>admin</p>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <p style="font-weight: bold;padding: 10px 0">悬赏审核</p>
      <el-radio-group
        v-model="verify.status"
        :disabled="status != 'waiting' && status != 'communication'"
        @change="statusChange"
      >
        <el-radio label="pass">通过</el-radio>
        <el-radio label="communication" v-if="status != 'communication'"
          >问题沟通</el-radio
        >
        <el-radio label="refuse">不通过</el-radio>
      </el-radio-group>
      <div
        v-if="verify.status == 'pass' && status !== 'pass'"
        style="margin-top:10px;color:#b4bbc5"
      >
        保障中用户，通过后悬赏费用将在7个自然日发放
      </div>
      <div
        v-if="verify.status == 'refuse' && status !== 'refuse'"
        style="margin-top:10px;color:#b4bbc5"
      >
        确认不通过后，该订单冻结费用将统一退还至商家账户
      </div>
      <el-form>
        <el-form-item
          :label="verify.status == 'communication' ? '测评问题' : '拒绝原因'"
          style="font-weight: bold;padding: 10px 0"
          v-if="
            (verify.status == 'communication' || verify.status == 'refuse') &&
              status !== 'refuse'
          "
        >
          <div class="relative-element">
            <el-input
              style="width:700px;"
              v-model="remark"
              type="textarea"
              rows="12"
              maxlength="500"
              show-word-limit
              :placeholder="
                verify.status == 'communication'
                  ? '请输入晒单问题'
                  : '请输入拒绝通过原因描述'
              "
            ></el-input>
            <div
              class="bottom-labels"
              ref="remarkLabels"
              v-if="status !== 'refuse'"
            >
              <el-tag
                v-for="tag in tags"
                :key="tag.name"
                @click="getValue(tag.name, $event)"
                class="tag"
              >
                {{ tag.name }}
              </el-tag>
            </div>
          </div>
          <span
            style="margin-top:10px;margin-left:80px;color:#b4bbc5"
            v-if="verify.status == 'communication'"
          >
            测评问题将通过短信和app消息推送给用户
          </span>
          <el-tooltip
            class="item"
            effect="dark"
            placement="top"
            style="margin-left:200px"
            v-if="verify.status == 'communication'"
          >
            <div slot="content" style="width:150px;">
              【映兔科技】订单号{{ verify.order_id }} 存在以下测评问题：{{
                remark
              }}，请及时前往App修改，逾期修改将无法发放悬赏。
            </div>
            <el-button type="text">预览短信文案</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="修改截止"
          style="font-weight: bold;padding: 10px 0"
          v-if="verify.status == 'communication' && status !== 'communication'"
        >
          <el-date-picker
            style="width:200px"
            align="right"
            v-model="deadline"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerDateOptions"
          >
          </el-date-picker>
          <el-tooltip
            class="item"
            effect="dark"
            content="截止时间前，若未重新提交测评链接，系统将不发放悬赏映币"
            placement="bottom"
            style="margin-left:10px"
          >
            <i class="el-icon-warning-outline" style="color:#999;"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="authList.indexOf('id128') > -1">
        <el-button
          :disabled="status != 'waiting' && status != 'communication'"
          @click="verifyClick(verify.order_id)"
          type="primary"
          >保存</el-button
        >
        <el-button @click="detailDg = false">取消</el-button>
      </div>
    </el-dialog>

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
          orderStatus == 'Finished' || authList.indexOf('id129') < 0
        "
      ></message>
    </el-dialog>
  </div>
</template>
<script>
import OrderDetail from "../../components/OrderDetail";
import Message from "../../components/Message";
import moment from "moment";
import BdSelect from "../../components/BdSelect";
export default {
  name: "RewardSettle",
  components: {
    OrderDetail,
    Message,
    BdSelect
  },
  data() {
    return {
      showRecordDg: false, // 协商记录
      order: {}, // 订单详情
      currOrderId: "", // 当前订单id
      detailDg: false, // 详情弹窗
      moment: moment,
      remark: "",
      dateTime: {},
      verify: {
        status: "", //审核状态
        order_id: ""
      },
      verify_list: [], //历史审核记录
      status: null, // 审核状态
      deadline: "",
      list: [],
      total: 0,
      tags: [
        { name: "#链接不符合要求#" },
        { name: "#图片数量/视频时长不足#" },
        { name: "#文案未正确提及品牌名#" },
        { name: "#不符合测评规范要求#" }
      ],
      search: {
        order_id: "",
        cp_nickname: "",
        campaign_name: "",
        start_time: "",
        end_time: "",
        status: "waiting",
        page_size: 10,
        page_id: 1,
        bd_admin_id: ""
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
    },
    pickerDateOptions() {
      let endTime = new Date().getTime();
      return {
        disabledDate(time) {
          return time.getTime() < endTime;
        }
      };
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    // 查看沟通记录
    async recordClick(data) {
      this.currOrderId = data.order_id || "";
      this.orderStatus = data.ticket_status || "";
      this.showRecordDg = true;
    },
    // 审核
    async verifyClick() {
      if (this.verify.status == "communication") {
        if (this.remark == "") {
          this.$message.error("请输入晒单问题！");
          return false;
        }
        if (this.deadline == "") {
          this.$message.error("请选择修改截止时间");
          return false;
        }
      } else {
        this.deadline = "";
      }
      if (this.verify.status == "refuse") {
        if (this.remark == "") {
          this.$message.error("请输入拒绝原因！");
          return false;
        }
      }
      let time;
      if (this.deadline !== "") {
        time = new Date(this.deadline).setHours(23, 59, 59) / 1000;
      } else {
        time = "";
      }
      if (this.remark.length >= 500) {
        this.$message.error("超出限制字数500，请修改！");
        return false;
      }

      let req = {
        status: this.verify.status,
        order_id: this.verify.order_id,
        appraisal_problem:
          this.verify.status == "communication" ? this.remark : "",
        refuse_reason: this.verify.status == "refuse" ? this.remark : "",
        fix_end_time: time
      };
      let res = await this.$api.rewardVerify(this.$initReq(req));
      if (res.error_code == 0) {
        this.$message.success("审核成功");
        this.detailDg = false;
        this.queryList();
      }
    },
    async detailClick(data) {
      this.verify.order_id = data.order_id;
      if (data.status == "communication") {
        this.verify.status = "";
      } else {
        this.verify.status = data.status;
      }
      this.status = data.status;
      let res = await this.$api.orderDetail({ order_id: data.order_id });
      if (res.error_code == 0) {
        this.order = res.data || {};
        this.verify_list = res.data.history_record || [];
        this.remark = res.data.appraisal_problem;
        this.deadline = moment(res.data.fix_end_time * 1000).format(
          "YYYY-MM-DD"
        );
        this.detailDg = true;
      }
    },
    statusChange() {
      this.remark = "";
      this.deadline = "";
    },
    async queryList() {
      let res = await this.$api.rewardSettleList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count || 0;
      }
    },
    async searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    // 切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    getValue(text) {
      this.remark += text;
    }
  }
};
</script>
<style lang="less" scoped>
.page-reward {
  .pagination {
    padding: 30px 0;
    text-align: center;
  }
}
.tag {
  margin-left: 5px;
  margin-bottom: 5px;
  &:hover {
    cursor: pointer;
  }
}
.relative-element {
  margin-left: 60px;
  position: relative;
  .bottom-labels {
    width: 598px;
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 1px;
    display: flex;
    flex-wrap: wrap;
    line-height: 18px;
    background-color: #fff;
  }
}
</style>
