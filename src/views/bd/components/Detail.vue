<template>
  <div class="page">
    <el-button type="text" @click="dialog = true">查看</el-button>
    <!-- dialog -->
    <el-dialog
      title="商户账号编辑"
      width="800px"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        :model="sponsor"
        :rules="rules"
        ref="sponsorForm"
        label-width="90px"
        label-position="left"
        :disabled="sponsor.account_status == 2 || sponsor.account_status == 4"
      >
        <el-row :gutter="20" style="border-bottom: 1px solid #dedede;">
          <el-col :span="12">
            <el-form-item label="BD负责人" prop="bd_admin_id">
              <div v-if="sponsor.pool_type == 3">
                <bd-select
                  :disabled="sponsor.auth_status == 4"
                  v-model="sponsor.bd_admin_id"
                ></bd-select>
                <el-button
                  :disabled="sponsor.auth_status == 4"
                  v-show="sponsor.bd_admin_id"
                  @click="resetBdAdmin"
                  type="primary"
                  >无负责人</el-button
                >
              </div>
              <div v-else>
                {{ allAdmin[sponsor.bd_admin_id] }}
              </div>
            </el-form-item>
            <el-form-item label="运营负责人">
              <admin-select
                v-model="sponsor.operator_admin_id"
                isSponsorOperator
              ></admin-select>
            </el-form-item>
            <el-form-item label="推荐码">
              <el-input
                style="width: 194px;"
                disabled
                :value="sponsor.invitation || '-'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户池">
              {{ poolList[sponsor.pool_type] }}
            </el-form-item>
            <el-form-item label="商户来源">
              <el-select v-model="sponsor.source" placeholder="选择商户来源">
                <el-option
                  v-for="(item, index) in sourceTemplate"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-form-item label="账户ID">
              <el-input
                :value="sponsor.sponsor_id ? sponsor.sponsor_id : '-'"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="企业名称" prop="company_name">
              <el-input
                v-model="sponsor.company_name"
                placeholder="请输入企业名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="user_name">
              <el-input
                v-model="sponsor.user_name"
                placeholder="请输入联系人姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺链接">
              <el-input
                v-model="sponsor.shop_link"
                placeholder="请输入店铺链接"
              ></el-input>
            </el-form-item>
            <el-form-item label="积分">{{
              sponsor.reward_point || 0
            }}</el-form-item>
            <el-form-item label="发货类型">
              <el-radio-group v-model="sponsor.express_type">
                <el-radio :label="1">商户发货</el-radio>
                <el-radio :label="2">平台发货</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="申请时间">
              <el-input
                :value="
                  sponsor.apply_time
                    ? moment(sponsor.apply_time * 1000).format(
                        'YYYY-MM-DD HH:mm'
                      )
                    : '-'
                "
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="映兔管家">
              <div>
                <el-radio-group v-model="sponsor.housekeeper_status">
                  <el-radio :value="false" :label="false">未开启</el-radio>
                  <el-radio :label="true">已设置</el-radio>
                </el-radio-group>
                <el-date-picker
                  style="width: 280px"
                  v-model="housekeeper_time"
                  :disabled="!sponsor.housekeeper_status"
                  type="daterange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录邮箱" prop="email">
              <el-input
                v-model="sponsor.email"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item label="授权品牌">
              <p v-if="sponsor.auth_brand">
                <el-tag
                  v-for="(brand, index) in sponsor.auth_brand"
                  :key="index"
                  >{{ brand }}</el-tag
                >
              </p>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input
                v-model="sponsor.phone"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item label="微信号">
              <el-input
                v-model="sponsor.wechat"
                placeholder="请输入微信号"
              ></el-input>
            </el-form-item>
            <el-form-item label="信用分">{{
              sponsor.credit_point || 0
            }}</el-form-item>
            <el-form-item label="置换活动">
              {{
                sponsor.free_exchange > 0
                  ? `剩余${sponsor.free_exchange}次`
                  : "-"
              }}
            </el-form-item>
            <el-form-item label="入驻时间">
              {{
                moment(sponsor.enter_time * 1000).format("YYYY-MM-DD HH:mm:ss")
              }}
            </el-form-item>
            <el-form-item label="认证状态">
              <el-tag v-if="sponsor.auth_status == 1">未提交</el-tag>
              <el-tag v-if="sponsor.auth_status == 2">待审核</el-tag>
              <el-tag type="success" v-if="sponsor.auth_status == 4"
                >已通过</el-tag
              >
              <el-tag type="danger" v-if="sponsor.auth_status == 5"
                >已冻结</el-tag
              >
              <el-tag type="danger" v-if="sponsor.auth_status == 3"
                >已拒绝</el-tag
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-top: 1px solid #dedede;"
          v-if="sponsor.payment"
        >
          <p style="color: #303133; font-size: 18px;padding: 20px 10px;">
            商户认证信息
          </p>
          <el-col :span="12">
            <el-form-item label="账户类型">
              <el-radio>对公账户</el-radio>
            </el-form-item>
            <el-form-item label="收款户名">{{
              sponsor.payment.account_name
            }}</el-form-item>
            <el-form-item label="收款账号">{{
              sponsor.payment.account_number
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户城市"
              >{{ sponsor.payment.account_province }}/{{
                sponsor.payment.account_city
              }}</el-form-item
            >
            <el-form-item label="银行名称">{{
              sponsor.payment.account_bank
            }}</el-form-item>
            <el-form-item label="开户支行">{{
              sponsor.payment.account_sub_bank
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <div>
            <el-button
              v-if="authList.indexOf('1601373231') > -1"
              type="primary"
              @click="submitSponsor()"
              >提交保存</el-button
            >
            <el-button @click="dialog = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /dialog -->
  </div>
</template>
<script>
import BdSelect from "../../../components/BdSelect";
import AdminSelect from "../../../components/AdminSelect";
import moment from "moment";
export default {
  name: "Detail",
  components: {
    BdSelect,
    AdminSelect
  },
  props: {
    sponsor: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      poolList: ["", "个人私有池", "个人发展池", "公司公海"],
      moment: moment,
      dialog: false,
      sourceTemplate: [
        "BD",
        "老客推荐",
        "博主推荐",
        "官网自主",
        "邮件",
        "微信",
        "微博推广",
        "线下活动"
      ],
      registTime: [], // 入驻时间
      housekeeper_time: [], // 映兔管家时间
      rules: {
        email: [
          {
            required: true,
            message: "请输入注册邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        company_name: [
          {
            required: true,
            message: "请输入企业名称",
            trigger: "blur"
          }
        ],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    },
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  watch: {
    housekeeper_time(val) {
      this.sponsor["housekeeper_start_time"] = moment(val[0]).unix();
      this.sponsor["housekeeper_end_time"] = moment(val[1]).unix();
    }
  },
  methods: {
    //submitSponsor 确认提交
    submitSponsor() {
      this.$refs.sponsorForm.validate(async ok => {
        if (ok) {
          //提交申请
          let method = "postCompanyInfo";
          if (this.sponsor.sponsor_id) {
            method = "sponsorModify";
          }
          let sponsor = {
            source: this.sponsor.source,
            sponsor_id: this.sponsor.sponsor_id,
            company_name: this.sponsor.company_name,
            email: this.sponsor.email,
            phone: this.sponsor.phone,
            // user_name: this.sponsor.contact_name,
            user_name: this.sponsor.user_name,
            bd_admin_id: this.sponsor.bd_admin_id,
            operation_admin_id: this.sponsor.operator_admin_id,
            status: this.sponsor.account_status,
            register_time: this.sponsor.apply_time,
            enter_time: this.sponsor.enter_time,
            wechat: this.sponsor.wechat,
            express_type: this.sponsor.express_type,
            brand_name: this.sponsor.brand_name,
            shop_link: this.sponsor.shop_link,
            invitation: this.sponsor.invitation,
            housekeeper_status: this.sponsor.housekeeper_status,
            housekeeper_start_time: this.sponsor.housekeeper_start_time,
            housekeeper_end_time: this.sponsor.housekeeper_end_time
          };
          let res = await this.$api[method](sponsor);
          if (res.error_code == 0) {
            this.$message.success("保存成功");
            this.dialog = false;
            this.$emit("refresh");
            //如果是新增  返回第一页
            if (method == "postCompanyInfo") {
              this.search.page_id = 1;
            }
            this.$emit("refresh");
            this.sponsorDialog = false;
          } else {
            this.$message.error("操作失败" + res.error_description);
          }
        } else {
          return false;
        }
      });
    },
    // 删除bd负责人
    resetBdAdmin() {
      if (this.sponsor.bd_admin_id) {
        delete this.sponsor.bd_admin_id;
        this.$forceUpdate();
      }
    }
  }
};
</script>
