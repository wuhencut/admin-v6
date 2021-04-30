<template>
  <div class="page">
    <el-button type="text" @click="authClick">新增授权</el-button>
    <el-dialog
      :visible.sync="dialog"
      append-to-body
      title="新建申请"
      width="1000px"
    >
      <el-form
        ref="form"
        :model="authData"
        label-width="100px"
        label-position="left"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="申请品牌" prop="brand_name">
              <div style="display: flex;">
                <el-autocomplete
                  v-model.trim="authData.brand_name"
                  :fetch-suggestions="searchBrand"
                  @select="handleSelect"
                ></el-autocomplete>
                <el-tag
                  v-if="authed"
                  style="margin-top: 3px; margin-left: 4px;"
                  type="danger"
                  >该品牌已被认证</el-tag
                >
              </div>
            </el-form-item>
            <el-form-item label="品牌logo">
              <upload-img v-model="authData.brand_logo" disabled></upload-img>
            </el-form-item>
            <el-form-item label="品牌等级" prop="brand_level">
              {{ authData.brand_level }}
            </el-form-item>
            <el-form-item label="主营类目" prop="category_list">
              <lazy-cascader
                v-model="authData.category_list"
                filterable
                v-if="dialog"
                :props="props"
                searchWidth:350px
              ></lazy-cascader>
            </el-form-item>
            <el-form-item label="产品渠道">
              <el-radio-group v-model="authData.import">
                <el-radio :label="true">进口</el-radio>
                <el-radio :label="false">非进口</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="认证方式">
              <el-radio-group v-model="authData.auth_method">
                <el-radio label="shop_link">店铺链接</el-radio>
                <el-radio label="industry_qualification_images"
                  >资质图片</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="相关资质">
              <p>
                <el-tag
                  ><a
                    target="_blank"
                    style="color: #409EFF; text-decoration: none;"
                    href="http://ingtube.udesk.cn/hc/articles/153571?api_name="
                    >行业资质要求</a
                  ></el-tag
                >
              </p>
              <el-form-item
                v-show="authData.auth_method == 'industry_qualification_images'"
                prop="industry_qualification_images"
                :rules="{
                  required:
                    authData.auth_method == 'industry_qualification_images',
                  message: '请上传店铺资质',
                  trigger: 'blur,change'
                }"
              >
                <upload-img-list
                  :length="10"
                  v-model="authData.industry_qualification_images"
                ></upload-img-list>
              </el-form-item>
              <!-- 单独拎出来做校验 -->
              <el-form-item
                v-show="authData.auth_method == 'shop_link'"
                prop="shop_link"
                :rules="{
                  required: authData.auth_method == 'shop_link',
                  message: '请填写店铺链接',
                  trigger: 'blur,change'
                }"
              >
                <el-input v-model="authData.shop_link"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="品牌关系">
              <el-radio-group v-model="authData.brand_auth_type">
                <el-radio :label="1">品牌方</el-radio>
                <el-radio :label="2">独家代理</el-radio>
                <el-radio :label="3">普通代理</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="注册号" prop="trademark_registration_id">
              <el-input
                v-model="authData.trademark_registration_id"
                placeholder="请输入注册号"
              ></el-input>
            </el-form-item>
            <el-form-item label="注册书" prop="trademark_registration_images">
              <upload-img-list
                :length="10"
                v-model="authData.trademark_registration_images"
              ></upload-img-list>
            </el-form-item>
            <el-form-item
              label="注册有效期"
              prop="trademark_registration_expired_date"
            >
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="authData.trademark_registration_expired_date"
                type="date"
                placeholder="请选择注册到期日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              v-show="authData.brand_auth_type != 1"
              label="授权书"
              prop="brand_auth_images"
              :rules="{
                required: authData.brand_auth_type != 1,
                message: '请上传授权书',
                trigger: 'blur,change'
              }"
            >
              <upload-img-list
                :length="10"
                v-model="authData.brand_auth_images"
              ></upload-img-list>
            </el-form-item>
            <el-form-item
              v-show="authData.brand_auth_type != 1"
              label="授权有效期"
              prop="brand_auth_expired_date"
              :rules="{
                required: authData.brand_auth_type != 1,
                message: '请填写授权有效期',
                trigger: 'blur,change'
              }"
            >
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="authData.brand_auth_expired_date"
                type="date"
                placeholder="请选择授权到期日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button @click="submit" type="primary" :disabled="authed"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增企业申请弹窗 -->
  </div>
</template>
<script>
import UploadImg from "../../../components/UploadImg";
import UploadImgList from "../../../components/UploadImgList";
import LazyCascader from "lazy-cascader";
export default {
  name: "NewAuth",
  props: {
    sponsor_id: {
      type: String,
      default: ""
    },
    categories: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: {
    LazyCascader,
    UploadImg,
    UploadImgList
  },
  data() {
    return {
      props: {
        multiple: true,
        checkStrictly: true,
        lazySearch: this.lazySearch,
        lazyLoad: this.lazyLoad,
        label: "name",
        value: "id",
        leaf: "leaf"
      }, // cascader参数
      cascaderOptions: [], // 类目
      authed: false,
      authData: {},
      dialog: false,
      rules: {
        trademark_registration_expired_date: [
          {
            required: true,
            message: "请填写注册有效期",
            trigger: "blur,change"
          }
        ],
        trademark_registration_images: [
          {
            required: true,
            message: "请上传注册书",
            trigger: "blur,change"
          }
        ],
        trademark_registration_id: [
          {
            required: true,
            message: "请填写注册号",
            trigger: "blur,change"
          }
        ],
        category_list: [
          {
            required: true,
            message: "请填写主营类目",
            trigger: "blur,change"
          }
        ],
        brand_name: [
          {
            required: true,
            message: "请填写品牌名",
            trigger: "blur, change"
          }
        ]
      },
      authTemp: {
        sponsor_id: "",
        brand_id: "",
        brand_auth_type: 3,
        import: true,
        category_list: [],
        trademark_registration_id: "",
        trademark_registration_images: [],
        trademark_registration_expired_date: null,
        brand_auth_images: [],
        brand_auth_expired_date: null,
        auth_method: "shop_link",
        shop_link: "",
        industry_qualification_images: [],
        apply_time: "",
        operation_admin_id: "",
        brand_auth_status: ""
      }
    };
  },
  created() {},
  computed: {
    // date选项
    pickerOptions() {
      return {
        disabledDate(time) {
          return (
            time.getTime() + 1000 * 3600 * 24 <
            Date.now() + 91 * 24 * 60 * 60 * 1000
          );
        }
      };
    }
  },
  methods: {
    async lazySearch(queryString, callback) {
      if (queryString === "") {
        callback([]);
        return false;
      }
      let res = await this.$api.getCategorySearchList({ name: queryString });
      if (res.error_code == 0) {
        const list = res.data.category || [];
        callback(list);
      }
    },
    async lazyLoad(nodeValue, resolve) {
      let req = {
        parent_id: nodeValue
      };
      let res = await this.$api.getBrandAuthCategory(req);
      if (res.error_code == 0 && Array.isArray(res.data)) {
        let list = res.data || [];
        let nodes = list.map(item => ({
          ...item,
          leaf: item.child_count <= 0 ? true : false,
          disabled: nodeValue == 0 ? true : false
        }));
        resolve(nodes);
      }
    },
    async submit() {
      this.$refs.form.validate(async ok => {
        if (ok) {
          let req = this.$initReq(this.authData);
          let res = await this.$api.newBrandAuth(req);
          if (res.error_code == 0) {
            this.$message.success("提交成功");
            this.dialog = false;
          }
        }
      });
    },
    async handleSelect(val) {
      this.authed = val.authed;
      this.authData.brand_id = val.brand_id;
      this.authData.brand_level = val.brand_level;
      this.authData.brand_logo = val.brand_logo;
      this.authData.brand_name = val.brand_name;
      this.authData.brand_story = val.brand_story;
      this.$forceUpdate();
    },
    async searchBrand(string, cb) {
      if (!string) {
        cb([]);
        return false;
      }
      let req = this.$initReq({
        sponsor_id: this.authData.sponsor_id,
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
    authClick() {
      this.authed = false;
      // 不能采用 { ...this.authTemp} 图片是结构，...只初始化一级
      this.authData = JSON.parse(JSON.stringify(this.authTemp)); // 初始化
      this.authData["sponsor_id"] = this.sponsor_id;
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      this.dialog = true;
    }
  }
};
</script>
