<template>
  <div class="page-credit-modify">
    <el-tabs v-model="tabName">
      <el-tab-pane label="博主信用" name="first">
        <el-tabs v-model="subName" type="card" @tab-click="handleClick">
          <el-tab-pane label="消除逾期" name="1"></el-tab-pane>
          <el-tab-pane label="消除差评" name="2"></el-tab-pane>
        </el-tabs>
        <div class="main">
          <h2 style="font-size: 16px; font-weight: bold;">注意:</h2>
          <p v-show="search.type == 1">
            •该功能仅消除逾期记录，并补加信用分 <br />
            •【消除逾期记录】后，将在移动端「守信记录」，新增一条消除逾期的记录
            <br />
            •【消除逾期记录】后，若有对应罚款需要关闭，请及时处理
          </p>
          <p v-show="search.type == 2">
            •该功能将直接关闭测评修改工单，消除差评记录，并补加信用分 <br />
            •【消除差评记录】后，将在移动端「守信记录」，新增一条消除差评的记录
            <br />
            •【消除差评记录】后，若有对应罚款，请及时关闭罚款
          </p>
          <el-form class="info">
            <el-form-item class="mod-search" label="订单编号:">
              <el-input
                style="width: 200px;"
                v-model="search.order_id"
                maxlength="19"
                placeholder="请输入订单编号"
              ></el-input>
              <el-button type="primary" @click="queryInfo"
                >查询{{ search.type == 1 ? "逾期" : "差评" }}记录</el-button
              >
            </el-form-item>
            <el-row :gutter="20" v-if="order">
              <el-col :span="12">
                <el-form-item label="订单详情:">
                  <order-detail :order="order"></order-detail>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="信用记录:">
                  <el-button
                    v-if="listInfo.credit_list && !listInfo.opera_history_list"
                    @click="clearClick"
                    style="float: right; margin-bottom: 20px;"
                    type="primary"
                    >消除{{ search.type == 1 ? "逾期" : "差评" }}记录</el-button
                  >
                  <el-table :data="listInfo.credit_list">
                    <el-table-column
                      label="信用明细"
                      prop="detail"
                    ></el-table-column>
                    <el-table-column label="信用变更" prop="modify">
                      <teplate slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.modify >= 0"
                          >+{{ scope.row.modify }}</el-tag
                        >
                        <el-tag type="danger" v-else>{{
                          scope.row.modify
                        }}</el-tag>
                      </teplate>
                    </el-table-column>
                    <el-table-column label="时间" prop="create_time">
                      <template slot-scope="scope">
                        {{
                          moment(scope.row.create_time * 1000).format(
                            "YYYY/MM/DD HH:mm:ss"
                          )
                        }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
                <el-form-item label="小二操作记录:">
                  <el-table :data="listInfo.opera_history_list">
                    <el-table-column
                      label="操作行为"
                      prop="operate"
                    ></el-table-column>
                    <el-table-column label="操作时间" prop="operate_time">
                      <template slot-scope="scope">
                        {{
                          moment(scope.row.operate_time * 1000).format(
                            "YYYY/MM/DD HH:mm:ss"
                          )
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作人" prop="admin_id">
                      <template slot-scope="scope">
                        {{ allAdmin[scope.row.admin_id] }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second" label="商家信用">
        <el-input
          maxlength="19"
          placeholder="输入商家ID"
          v-model="sponsor_id"
        ></el-input>
        <el-button class="btn" type="primary" @click="nextClick"
          >下一步</el-button
        >
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="creditDg" title="加减信用" width="550px">
      <el-form label-width="90px">
        <el-form-item label="企业名称" prop="company_name">
          <el-input v-model="company_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前分数" prop="credit_point">
          <el-input v-model="credit_point" disabled></el-input>
        </el-form-item>
        <el-form-item label="加 / 减">
          <el-radio-group v-model="modifyType">
            <el-radio label="+">加</el-radio>
            <el-radio label="-">减</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分数">
          <el-input v-model="modify"></el-input>
        </el-form-item>
        <el-form-item label="活动id">
          <el-input v-model="campaign_id"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            placeholder="请输入理由"
            maxlength="20"
            v-model="remark"
            :rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="creditDg = false">取消</el-button>
        <el-button @click="getCampaignName" type="primary">确定</el-button>
      </div>

      <el-dialog
        style="font-weight: bold"
        width="400px"
        :visible.sync="showConfirmDg"
        title="确认操作"
        append-to-body
      >
        <el-form>
          <el-form-item label="企业名称: ">{{ company_name }}</el-form-item>
          <el-form-item label="当前信用: ">{{ credit_point }}</el-form-item>
          <el-form-item label="变更分数: "
            >{{ modifyType }}{{ modify }}</el-form-item
          >
          <el-form-item label="活动名称: ">{{ campaignName }}</el-form-item>
          <el-form-item label="变更理由: ">{{ remark }}</el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="showConfirmDg = false">取消</el-button>
          <el-button type="primary" @click="modifyClick">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import OrderDetail from "../../components/OrderDetail";
import moment from "moment";
export default {
  name: "CreditModify",
  components: {
    OrderDetail
  },
  data() {
    return {
      moment: moment,
      search: {
        type: 1, // 逾期 2 差评
        order_id: ""
      },
      order: null,
      listInfo: {},
      showInfo: false, // 展示订单信息
      tabName: "first", //
      subName: "1", // 子菜单tab
      modifyType: "+", // 类型
      creditDg: false, // 弹窗
      sponsor_id: "",
      company_name: "",
      credit_point: "",
      modify: "", // 分数
      remark: "", // 备注
      campaign_id: "", //活动id
      showConfirmDg: false, // 确认弹窗
      campaignName: "" // 活动名
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  methods: {
    // 查询信息
    queryInfo() {
      if (!this.search.order_id) {
        this.$message.error("请输入订单id");
        return false;
      }
      this.getDetail();
      this.getList();
    },
    // 订单详情
    async getDetail() {
      let res = await this.$api.orderDetail({ order_id: this.search.order_id });
      if (res.error_code == 0) {
        this.order = res.data;
      } else {
        this.order = null;
      }
    },
    // 获取列表信息
    async getList() {
      this.search.type -= 0;
      let res = await this.$api.getCreditList(this.search);
      if (res.error_code == 0) {
        this.listInfo = res.data || {};
      } else {
        this.listInfo = null;
      }
    },
    async clearClick() {
      this.$confirm(
        `确定清除${this.search.type == 1 ? "逾期" : "差评"}记录?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "让我再think think",
          type: "warning"
        }
      ).then(async () => {
        this.confirmClear();
      });
    },
    // 清除记录
    async confirmClear() {
      let methods = {
        1: "clearOverdue",
        2: "clearViolate"
      };
      let res = await this.$api[methods[this.search.type]]({
        order_id: this.search.order_id
      });
      if (res.error_code == 0) {
        this.$message.error("清除成功");
        this.getList();
      }
    },
    // 切换tab
    handleClick(tab) {
      this.search.type = tab.name;
      this.order = null;
    },
    async nextClick() {
      if (!this.sponsor_id) {
        this.$message.error("请输入商家id");
        return false;
      }
      // 获取商户名
      let res = await this.$api.getCreditInfo({ sponsor_id: this.sponsor_id });
      if (res.error_code == 0) {
        this.company_name = res.data.company_name;
        this.credit_point = res.data.credit_point;
        this.remark = "";
        this.modifyType = "+";
        this.creditDg = true;
      }
    },
    // 修改提交
    async modifyClick() {
      let res = await this.$api.modifyCreditInfo({
        sponsor_id: this.sponsor_id,
        modify: this.modifyType == "-" ? 0 - this.modify : this.modify - 0,
        remark: this.remark,
        campaign_id: this.campaign_id
      });
      if (res.error_code == 0) {
        this.$message.success("修改成功");
        this.creditDg = false;
        this.showConfirmDg = false;
      }
    },
    // 获取活动名
    async getCampaignName() {
      if (!/^\d+$/.test(this.modify)) {
        this.$message.error("需要加减的分数应该是个正整数");
        this.modify = "";
        return false;
      }
      if (!this.remark) {
        this.$message.error("请输入备注");
        return false;
      }
      let res = await this.$api.getPreviewData({
        campaign_id: this.campaign_id
      });
      if (res.error_code == 0) {
        this.campaignName = res.data.title;
        this.showConfirmDg = true;
      } else {
        this.$message.error("未查询到该活动ID，请确认是否输入正确");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.page-credit-modify {
  padding: 0 10px;
  background: #fff;
  .main {
    > .info {
      > .mod-search {
        padding-top: 20px;
        display: flex;
        button {
          vertical-align: 1px;
        }
      }
    }
  }
  .btn {
    margin: 10px 0;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #409eff;
    line-height: 2;
    border-bottom: 1px solid #dedede;
  }
}
</style>
