<template>
  <div class="page">
    <el-button type="text" @click="certClick">新增认证</el-button>

    <!-- 新增企业认证弹窗 -->
    <el-dialog
      append-to-body
      :visible.sync="dialog"
      title="企业认证"
      width="800px"
    >
      <el-form
        ref="form"
        :model="certData"
        label-width="90px"
        label-position="left"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账户类型">
              <el-radio-group v-model="certData.sponsor_account_type">
                <el-radio label="brand_owner">品牌方</el-radio>
                <el-radio label="brand_agent">代理商</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="营业执照" prop="business_license_image">
              <upload-img
                v-model="certData.business_license_image"
                style="width: 100px; height: 100px;"
              ></upload-img>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信用代码" prop="usci">
              <el-input
                v-model="certData.usci"
                placeholder="请输入信用代码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button @click="submit" type="primary">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增企业认证弹窗 -->
  </div>
</template>
<script>
import UploadImg from "../../../components/UploadImg";
export default {
  name: "NewCert",
  components: {
    UploadImg
  },
  props: {
    sponsor_id: String
  },
  data() {
    return {
      dialog: false,
      certData: {
        sponsor_account_type: "brand_owner",
        business_license_image: "",
        usci: "",
        sponsor_id: ""
      }, // 新增认证
      rules: {
        business_license_image: [
          {
            required: true,
            message: "选择资质证明",
            trigger: "blur"
          }
        ],
        usci: [
          {
            required: true,
            message: "请填写信用代码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    certClick() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      this.certData = {
        sponsor_account_type: "brand_owner",
        business_license_image: "",
        usci: "",
        sponsor_id: this.sponsor_id
      };
      this.dialog = true;
    },
    // 提交新增认证
    async submit() {
      this.$refs.form.validate(async ok => {
        if (ok) {
          let req = this.$initReq(this.certData);
          let res = await this.$api.createCompanyAuth(req);
          if (res.error_code == 0) {
            this.$message.success("新增成功");
            this.dialog = false;
            this.$emit("refresh");
          }
        }
      });
    }
  }
};
</script>
