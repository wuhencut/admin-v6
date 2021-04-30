<template>
  <div class="page-sponsor-apply">
    <div class="header">
      <el-form inline>
        <el-form-item>
          <el-input
            class="search-inp"
            placeholder="企业名称"
            v-model.trim="search.company_name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            class="search-inp"
            v-model="search.company_verify_status"
            @change="searchBtnClick"
          >
            <el-option value label="认证状态"></el-option>
            <el-option :value="1" label="待审核"></el-option>
            <el-option :value="2" label="已通过"></el-option>
            <el-option :value="3" label="已拒绝"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="search.brand_auth" @change="changeStatus"
            >有品牌授权可审核</el-checkbox
          >
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
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchBtnClick"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
      <el-table :data="list">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="企业名称"
          prop="company_name"
          width="160"
        ></el-table-column>
        <el-table-column label="申请时间" prop="applyTime" width="160">
          <template slot-scope="scope">{{
            moment(scope.row.apply_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          }}</template>
        </el-table-column>
        <el-table-column
          label="联系人"
          prop="contact_name"
          width="140"
        ></el-table-column>
        <!-- 邀请码/邀请人 -->
        <el-table-column label="邀请码/邀请人" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.inviter_code == ''">-</div>
            <div v-else>
              <p>{{ scope.row.inviter_code }}</p>
              <p>{{ scope.row.inviter }}</p>
            </div>
          </template>
        </el-table-column>
        <!-- 邀请码/邀请人 -->
        <el-table-column label="BD负责人" width="140">
          <template slot-scope="scope">{{
            allAdmin[scope.row.bd_admin_id]
          }}</template>
        </el-table-column>
        <el-table-column label="审核状态" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.company_verify_status == 1">待审核</el-tag>
            <el-tag v-if="scope.row.company_verify_status == 2" type="success"
              >已通过</el-tag
            >
            <el-tag v-if="scope.row.company_verify_status == 3" type="danger"
              >已拒绝</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="checkClick(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="currentChange"
          :current-page="search.page_id"
        ></el-pagination>
      </div>
    </div>
    <!-- list -->

    <!-- dialog -->
    <el-dialog
      v-if="sponsor"
      :visible.sync="showDg"
      title="企业认证"
      width="900px"
    >
      <el-dialog :visible.sync="showImg" title="营业执照" append-to-body>
        <div style="text-align: center;">
          <img :src="sponsor.business_license_image" alt style="width: 100%;" />
        </div>
      </el-dialog>
      <el-form
        :model="sponsor"
        label-width="100px"
        ref="companyInfoForm"
        :rules="companyInfoRules"
      >
        <el-row :gutter="20" style="border-bottom: 1px solid #dedede;">
          <el-col :span="12">
            <el-form-item label="营业执照">
              <upload-img v-model="sponsor.business_license_image"></upload-img>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信用代码" prop="usci">
              <el-input
                v-model="sponsor.usci"
                placeholder="请输入请用代码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row
          :gutter="20"
          style="border-bottom: 1px solid #dedede; margin-top: 20px;"
        >
          <el-col :span="12">
            <el-form-item label="企业名称" prop="company_name">
              <el-input
                v-model="sponsor.company_name"
                placeholder="请输入企业名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺链接" prop="shop_link">
              <el-input
                v-model="sponsor.shop_link"
                placeholder="请输入店铺链接"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact_name">
              <el-input
                v-model="sponsor.contact_name"
                placeholder="请输入联系人姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号" v-if="sponsor.phone_number">
              <div style="display:flex;">
                <el-form-item prop="phone_number.country_code">
                  <el-input
                    style="width: 70px;"
                    v-model="sponsor.phone_number.country_code"
                    placeholder="国家号"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="phone_number.phone_number">
                  <el-input
                    style="flex: 1;"
                    v-model="sponsor.phone_number.phone_number"
                    placeholder="请输入手机号"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="BD负责人" prop="bd_admin_id">
              <bd-select
                :disabled="sponsor.company_verify_status != 1"
                v-model="sponsor.bd_admin_id"
              ></bd-select>
            </el-form-item>
            <el-form-item label="运营负责人" prop="operation_admin_id">
              <admin-select
                v-model="sponsor.operation_admin_id"
                isSponsorOperator
              ></admin-select>
            </el-form-item>
            <el-form-item label="商户来源" prop="sponsor_source">
              <el-select v-model="sponsor.sponsor_source">
                <el-option
                  v-for="(item, index) in sourceTemplate"
                  :value="item"
                  :label="item"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="推荐人" prop="invitation">{{
              sponsor.inviter
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            sponsor.company_verify_status == 3 ||
              sponsor.company_verify_status == 2
          "
          :gutter="20"
          style="border-bottom: 1px solid #dedede; margin-top: 20px;"
        >
          <el-col :span="12">
            <el-form-item label="操作人">
              {{ allAdmin[sponsor.operator_id] }}
            </el-form-item>
            <el-form-item
              v-if="sponsor.company_verify_status == 3"
              style="padding-top: 10px;"
              label="拒绝理由"
            >
              <el-tag type="danger">{{ sponsor.refuse_reason || "-" }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间">
              {{
                moment(sponsor.operate_time * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <template
          v-if="
            sponsor.company_verify_status != 3 &&
              sponsor.company_verify_status != 2
          "
        >
          <template v-if="authList.indexOf('id81') > -1">
            <el-button type="primary" @click="verifyClick('approve')"
              >审核通过</el-button
            >
            <el-button type="danger" @click="verifyClick('refuse')"
              >审核拒绝</el-button
            >
          </template>
        </template>
        <template v-if="authList.indexOf('id82') > -1">
          <el-button @click="showDg = false">取消</el-button>
          <el-button type="primary" @click="saveCLick">保存</el-button>
        </template>
      </div>
    </el-dialog>
    <!-- dialog -->
    <!-- 拒绝dialog -->
    <el-dialog :visible.sync="refuseDg" title="拒绝理由">
      <el-input
        v-model="refuseReason"
        :rows="5"
        type="textarea"
        maxlength="200"
        placeholder="请输入拒绝理由"
      ></el-input>
      <div slot="footer">
        <el-button @click="refuseDg = false">取消</el-button>
        <el-button @click="verify('refuse')" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <!-- 拒绝dialog -->
  </div>
</template>
<script>
import moment from "moment";
import UploadImg from "../../components/UploadImg";
import BdSelect from "../../components/BdSelect";
import AdminSelect from "../../components/AdminSelect";
export default {
  components: {
    UploadImg,
    BdSelect,
    AdminSelect
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    authList() {
      return this.$store.getters.getAuthList;
    },
    companyInfoRules() {
      return {
        usci: [
          {
            required: true,
            message: "请填写信用代码",
            trigger: "blur"
          }
        ],
        company_name: [
          {
            required: true,
            message: "请填写企业名称",
            trigger: "blur,change"
          }
        ],
        "phone_number.phone_number": [
          {
            required: true,
            message: "请填写正确的手机号",
            pattern: /^\d{5,13}$/,
            trigger: "blur,change"
          }
        ],
        "phone_number.country_code": [
          {
            required: true,
            message: "请正确填写+开头的区号",
            pattern: /^\+\d{1,3}$/,
            trigger: "blur,change"
          }
        ],
        bd_admin_id: [
          {
            required: this.sponsor.company_verify_status == 1,
            message: "请选择BD负责人",
            trigger: "blur,change"
          }
        ],
        sponsor_source: [
          {
            required: true,
            message: "请选择商户来源",
            trigger: "blur,change"
          }
        ]
      };
    }
  },
  data() {
    return {
      refuseReason: "", // 拒绝理由
      showImg: false, // 展示营业执照
      showDg: false, // 弹窗
      moment: moment,
      total: 0,
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
      list: [],
      sponsor: {},
      search: {
        company_name: "",
        bd_admin_id: "",
        company_verify_status: 1,
        brand_auth: true,
        page_id: 1,
        page_size: 10
      },
      refuseDg: false // 拒绝弹窗
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    async saveCLick() {
      this.$refs.companyInfoForm.validate(async ok => {
        if (ok) {
          let req = this.$initReq(this.sponsor);
          let res = await this.$api.saveCompanyAuthInfo(req);
          if (res.error_code == 0) {
            this.$message.success("保存成功");
            this.showDg = false;
            this.queryList();
          }
        }
      });
    },
    checkClick(data) {
      if (this.$refs.companyInfoForm) {
        this.$refs.companyInfoForm.clearValidate();
        this.$refs.companyInfoForm.resetFields();
      }
      // 防止改变列表的值
      this.sponsor = JSON.parse(JSON.stringify(data));
      this.showDg = true;
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    changeStatus() {
      this.searchBtnClick();
    },
    async verifyClick(type) {
      this.$refs.companyInfoForm.validate(async ok => {
        if (ok) {
          if (type == "approve") {
            this.verify(type);
          } else {
            this.refuseReason = "";
            this.refuseDg = true;
          }
        }
      });
    },
    async verify(type) {
      if (!this.refuseReason && type == "refuse") {
        this.$message.error("请填写拒绝理由！");
        return false;
      }
      let req = JSON.parse(JSON.stringify(this.sponsor));
      req.company_verify_status = type;
      req["refuse_reason"] = this.refuseReason;
      req = this.$initReq(req);
      let res = await this.$api.verifyCompanyAuth(req);
      if (res.error_code == 0) {
        if (type == "approve") {
          this.$message.info("已审核");
          this.queryList();
        } else {
          this.$message.info("已拒绝");
          this.refuseDg = false;
        }
        this.showDg = false;
        this.refuseDg = false;
        this.queryList();
      }
    },
    async queryList() {
      let req = this.$initReq(this.search);
      let res = await this.$api.getBusinessLicenseList(req);
      if (res.error_code == 0) {
        this.list = res.data.sponsor_user || [];
        this.total = res.data.count || 0;
      }
    },
    //页码变更
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    }
  }
};
</script>
<style lang="less" scoped>
.remark-list {
  overflow-y: scroll;
  max-height: 300px;
  .remark-item {
    border-bottom: 1px solid #dedede;
    padding: 10px 0;
    .remark-content {
      letter-spacing: 1px;
    }
    .remark-title {
      font-weight: bold;
    }
  }
}

.new-remark {
  padding-top: 10px;
}
</style>
