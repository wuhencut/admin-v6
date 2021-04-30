<template>
  <div class="page-brand">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="企业名称"
          v-model.trim="search.company_name"
          @change="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="申请品牌"
          v-model.trim="search.brand_name"
          @change="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.brand_level"
          @change="searchBtnClick"
        >
          <el-option value label="品牌等级"></el-option>
          <el-option
            v-for="(level, index) in levelList"
            :key="index"
            :value="level.value"
            :label="level.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.brand_auth_status"
          @change="searchBtnClick"
        >
          <el-option value label="认证状态"></el-option>
          <el-option :value="3" label="待审核"></el-option>
          <el-option :value="1" label="已拒绝"></el-option>
          <el-option :value="2" label="已通过"></el-option>
          <el-option :value="5" label="已解除"></el-option>
          <el-option :value="4" label="已过期"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="authList.indexOf('id83') > -1">
        <bd-select
          class="search-inp"
          v-model="search.bd_admin_id"
          isAll
          isNew
          @change="searchBtnClick"
        ></bd-select>
      </el-form-item>
      <el-form-item>
        <admin-select
          class="search-inp"
          isAll
          isNew
          v-model="search.operation_admin_id"
          @change="searchBtnClick"
        ></admin-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.auth_level" @change="searchBtnClick">
          <el-option value label="所有入驻方式"></el-option>
          <el-option :value="1" label="证书授权"></el-option>
          <el-option :value="2" label="协议授权"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchBtnClick"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <!-- list -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="企业名称" prop="company_name"></el-table-column>
      <el-table-column label="申请时间" prop="apply_time" width="160">
        <template slot-scope="scope">
          {{
            moment(scope.row.apply_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column label="申请品牌" prop="brand_name"></el-table-column>
      <el-table-column label="品牌等级" prop="brand_level"></el-table-column>
      <el-table-column label="运营负责人" prop="operation_admin_id">
        <template slot-scope="scope">
          {{ allAdmin[scope.row.operation_admin_id] }}
        </template>
      </el-table-column>
      <el-table-column label="BD负责人">
        <template slot-scope="scope">
          {{ allAdmin[scope.row.bd_admin_id] }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="brand_auth_status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.brand_auth_status == 2" type="success"
            >已通过</el-tag
          >
          <el-tag v-if="scope.row.brand_auth_status == 1" type="danger"
            >已拒绝</el-tag
          >
          <el-tag v-if="scope.row.brand_auth_status == 3">待审核</el-tag>
          <el-tag v-if="scope.row.brand_auth_status == 4" type="danger"
            >已过期</el-tag
          >
          <el-tag v-if="scope.row.brand_auth_status == 5" type="danger"
            >已解除</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="checkClick(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        :page-size="10"
        :current-page="search.page_id"
      ></el-pagination>
    </div>
    <!-- 详情dg -->
    <div v-if="detailDg" id="detail">
      <el-dialog :visible.sync="detailDg" title="品牌授权" width="1000px">
        <el-form
          label-position="left"
          label-width="100px"
          :model="brandInfo"
          :rules="formRules"
          ref="brandForm"
          :disabled="allDisabled"
        >
          <el-row :gutter="20" style="border-bottom: 1px solid #dedede; ">
            <el-col :span="14">
              <el-form-item label="申请品牌" prop="brand_name">
                {{ brandInfo.brand_name }}
              </el-form-item>
              <el-form-item label="品牌logo" prop="brand_logo">
                <upload-img
                  v-model="brandInfo.brand_logo"
                  disabled
                ></upload-img>
              </el-form-item>
              <el-form-item label="品牌等级" prop="brand_level">
                {{ brandInfo.brand_level }}
              </el-form-item>
              <el-form-item label="主营类目" prop="category_list">
                <lazy-cascader
                  v-model="brandInfo.category_list"
                  filterable
                  v-if="detailDg"
                  :props="props"
                  :disabled="casDisabled"
                ></lazy-cascader>
              </el-form-item>
              <el-form-item label="产品渠道">
                <el-radio-group v-model="brandInfo.import">
                  <el-radio :label="true">进口</el-radio>
                  <el-radio :label="false">非进口</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="认证方式" v-if="brandInfo.auth_level == 1">
                <el-radio-group v-model="brandInfo.auth_method">
                  <el-radio label="shop_link">店铺链接</el-radio>
                  <el-radio label="industry_qualification_images"
                    >资质图片</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="相关资质" v-if="brandInfo.auth_level == 1">
                <el-form-item
                  prop="shop_link"
                  v-if="brandInfo.auth_method == 'shop_link'"
                >
                  <el-input
                    v-if="brandInfo.auth_method == 'shop_link'"
                    v-model="brandInfo.shop_link"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="industry_qualification_images" v-else>
                  <upload-img-list
                    :length="10"
                    v-model="brandInfo.industry_qualification_images"
                  ></upload-img-list>
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="品牌关系">
                <el-radio-group v-model="brandInfo.brand_auth_type">
                  <el-radio :label="1" :disabled="disabled">品牌方</el-radio>
                  <el-radio :label="2" :disabled="disabled">独家代理</el-radio>
                  <el-radio :label="3">普通代理</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="brandInfo.auth_level == 1">
                <el-form-item label="注册书号" prop="trademark_registration_id">
                  <el-input
                    v-model="brandInfo.trademark_registration_id"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="注册书"
                  prop="trademark_registration_images"
                >
                  <upload-img-list
                    :length="10"
                    v-model="brandInfo.trademark_registration_images"
                  ></upload-img-list>
                </el-form-item>
                <el-form-item
                  label="注册有效期"
                  prop="trademark_registration_expired_date"
                >
                  <el-date-picker
                    v-model="brandInfo.trademark_registration_expired_date"
                    type="date"
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  prop="brand_auth_images"
                  :label="
                    brandInfo.brand_auth_type == 2 ? '独占授权书' : '品牌授权书'
                  "
                  v-show="brandInfo.brand_auth_type != 1"
                  :rules="{
                    required: brandInfo.brand_auth_type != 1,
                    message: '请上传品牌授权书',
                    trigger: 'blur,change'
                  }"
                >
                  <upload-img-list
                    v-model="brandInfo.brand_auth_images"
                  ></upload-img-list>
                </el-form-item>
                <el-form-item
                  label="授权有效期"
                  prop="brand_auth_expired_date"
                  v-if="brandInfo.brand_auth_type != 1"
                >
                  <el-date-picker
                    v-model="brandInfo.brand_auth_expired_date"
                    type="date"
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <div v-show="brandInfo.auth_level == 2">
                <el-form-item label="协议">
                  <span>已同意</span>
                  <el-button
                    type="text"
                    @click="showDg = true"
                    style="margin-left:10px"
                    >协议内容</el-button
                  >
                </el-form-item>
                <el-form-item label="甲方公司" prop="first_party">
                  <span>{{ brandInfo.first_party }}</span>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row style="border-bottom: 1px solid #dedede; margin-top: 20px;">
            <el-col :span="12">
              <el-form-item label="企业名称">{{
                brandInfo.company_name
              }}</el-form-item>
              <el-form-item
                label="已授权品牌"
                v-if="brandInfo.approve_band_list"
              >
                <template v-if="brandInfo.approve_band_list.length">
                  <el-tag
                    style="margin-right: 4px;"
                    v-for="(item, index) in brandInfo.approve_band_list"
                    :key="index"
                    >{{ item }}</el-tag
                  >
                </template>
                <el-tag v-if="!brandInfo.approve_band_list.length" type="danger"
                  >无</el-tag
                >
              </el-form-item>
              <el-form-item
                v-show="brandInfo.brand_auth_status == 5"
                label="解除授权操作人"
                label-width="120px"
              >
                {{ allAdmin[brandInfo.operator_id] }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账户类型">{{
                brandInfo.sponsor_account_type == "brand_owner"
                  ? "品牌方"
                  : "代理商"
              }}</el-form-item>
            </el-col>
          </el-row>
          <el-row
            style="margin-top: 20px;border-bottom: 1px solid #dedede;"
            v-show="brandInfo.refuse_reason"
          >
            <el-form-item label="拒绝理由">
              <el-tag type="danger">{{ brandInfo.refuse_reason }}</el-tag>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col>
              <el-table :data="innerList" style="margin-top:30px">
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  label="已授权企业名称"
                  prop="company_name"
                ></el-table-column>
                <el-table-column label="品牌关系">
                  <template slot-scope="scope">
                    <p v-show="scope.row.brand_auth_type == 1">品牌方</p>
                    <p v-show="scope.row.brand_auth_type == 2">独家代理</p>
                    <p v-show="scope.row.brand_auth_type == 3">普通代理</p>
                  </template>
                </el-table-column>
                <el-table-column label="授权状态">
                  <template slot-scope="scope">
                    <p v-show="scope.row.status == 1">申请中</p>
                    <p v-show="scope.row.status == 2">授权中</p>
                    <p v-show="scope.row.status == 3">已过期</p>
                    <p v-show="scope.row.status == 4">已解除</p>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination" v-if="innerCount > 0">
                <el-pagination
                  small
                  layout="total,prev, pager, next"
                  :total="innerCount"
                  @current-change="innerChange"
                  :page-size="page_size"
                  :current-page="page_id"
                >
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <template
            v-if="
              brandInfo.brand_auth_status == 3 && authList.indexOf('id84') > -1
            "
          >
            <el-button type="primary" @click="verifyBrandAuth(2)"
              >审核通过</el-button
            >
            <el-button
              type="danger"
              @click="
                refuseDg = true;
                refuseReason = '';
              "
              >审核拒绝</el-button
            >
          </template>
          <template v-if="authList.indexOf('id85') > -1">
            <el-button
              v-show="
                brandInfo.brand_auth_status == 2 ||
                  brandInfo.brand_auth_status == 4
              "
              @click="removeDg = true"
              >解除认证</el-button
            >
            <el-button type="primary" @click="saveClick" :disabled="casDisabled"
              >保存</el-button
            >
            <el-button @click="detailDg = false">取消</el-button>
          </template>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="确定解除授权？" :visible.sync="removeDg" width="500px">
      <p>
        <span>企业名称：</span><span>{{ brandInfo.company_name }}</span>
      </p>
      <p style="margin-top:30px">
        <span>解除品牌名：</span>
        <span>{{ brandInfo.brand_name }}</span>
      </p>
      <p style="margin-top:30px;display:flex">
        <span>解除品牌Logo：</span
        ><img
          :src="brandInfo.brand_logo"
          width="70px"
          height="70px"
          style="border:1px solid"
        />
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeDg = false">取 消</el-button>
        <el-button type="primary" @click="relieve">确 定</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <el-dialog title="协议详情" :visible.sync="showDg" width="600px">
      <div style="margin:0 auto">
        <img :src="require('../../assets/xieyishu.png')" />
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
    <!-- refuseDg -->
    <el-dialog :visible.sync="refuseDg" title="拒绝理由">
      <el-input
        v-model="refuseReason"
        type="textarea"
        maxlength="200"
        placeholder="请输入拒绝理由"
        :rows="5"
      ></el-input>
      <div slot="footer">
        <el-button @click="refuseDg = false">取消</el-button>
        <el-button type="danger" @click="verifyBrandAuth(1)">拒绝</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import mmm from "../../assets/xieyishu.png";
import moment from "moment";
import UploadImg from "../../components/UploadImg";
import UploadImgList from "../../components/UploadImgList";
import AdminSelect from "../../components/AdminSelect";
import BdSelect from "../../components/BdSelect";
import LazyCascader from "lazy-cascader";
export default {
  components: {
    UploadImg,
    UploadImgList,
    AdminSelect,
    BdSelect,
    LazyCascader
  },
  data() {
    // 校验注册有效期
    var validate1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择注册有效期"));
      } else if (moment(value).valueOf() < Date.now()) {
        callback(new Error("注册有效期不能过期"));
      } else {
        callback();
      }
    };
    // 校验授权有效期
    var validate2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择授权有效期"));
      } else if (moment(value).valueOf() < Date.now()) {
        callback(new Error("授权有效期不能过期"));
      } else {
        callback();
      }
    };
    return {
      cascaderOptions: [],
      filterKey: "",
      category_array: [],
      data: [],
      count: 1,
      flag: false,
      innerList: [],
      showDg: false,
      removeDg: false,
      disabled: false,
      allDisabled: false,
      casDisabled: false,
      props: {
        multiple: true,
        checkStrictly: true,
        lazySearch: this.lazySearch,
        lazyLoad: this.lazyLoad,
        label: "name",
        value: "id",
        leaf: "leaf"
      },
      verifyDisable: false, // 防止重复点击
      // 品牌等级列表
      levelList: [
        {
          // 品牌等级列表
          value: "B",
          label: "B"
        },
        {
          value: "A",
          label: "A"
        },
        {
          value: "KA",
          label: "KA"
        },
        {
          value: "无等级",
          label: "无等级"
        }
      ],
      array: [],
      categories: [], // 所有主营类目列表
      refuseDg: false,
      moment: moment,
      total: 10,
      list: [],
      innerCount: 0,
      page_id: 1,
      page_size: 5,
      search: {
        auth_level: "",
        company_name: "",
        brand_name: "",
        brand_level: "",
        brand_auth_status: 3,
        operation_admin_id: "",
        page_id: 1,
        page_size: 10,
        bd_admin_id: ""
      },
      brandInfo: {
        brand_auth_images: [],
        industry_qualification_images: [],
        trademark_registration_images: []
      },
      detailDg: false,
      refuseReason: "", // 拒绝理由
      formRules: {
        trademark_registration_expired_date: [
          {
            required: true,
            validator: validate1,
            trigger: "blur,change"
          }
        ],
        brand_auth_expired_date: [
          {
            validator: validate2,
            trigger: "blur,change"
          }
        ],
        trademark_registration_id: [
          {
            required: true,
            message: "请填写注册书号",
            trigger: "blur"
          }
        ],
        trademark_registration_images: [
          {
            required: true,
            message: "请上传注册书",
            trigger: "blur,change"
          }
        ],
        category_list: [
          {
            required: true,
            message: "请选择类目",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  watch: {
    "brandInfo.category_list"(val) {
      let array = [];
      let nextArray = [];
      val.map(item => {
        array.push(item[0]);
      });
      val.map(item => {
        nextArray.push(item[1]);
      });
      let mapArray = Array.from(new Set(array));
      let nextMapArray = Array.from(new Set(nextArray));
      let result = mapArray.some(item => {
        return [4, 7, 9, 10].includes(item);
      });
      let other = nextMapArray.some(item => {
        return [
          1871,
          1875,
          1876,
          4514,
          4515,
          4517,
          4519,
          4520,
          4521,
          4523,
          4524,
          4526,
          4527,
          4528,
          8144,
          7069
        ].includes(item);
      });
      if (result && other) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
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
    this.queryList();
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

    // 保存按钮
    async saveClick() {
      if (
        this.flag &&
        this.brandInfo.industry_qualification_images.length == 0 &&
        this.brandInfo.shop_link == ""
      ) {
        this.$message.error("必须上传相关资质");
        return false;
      }
      this.$refs.brandForm.validate(async ok => {
        if (ok) {
          let res = await this.$api.brandAuthSave(this.brandInfo);
          if (res.error_code == 0) {
            this.queryList();
            this.$message.success("保存成功");
            this.detailDg = false;
          }
        }
      });
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
    // // 点击审核按钮
    async verifyBrandAuth(type) {
      if (
        this.brandInfo.auth_level == 1 &&
        this.flag &&
        this.brandInfo.industry_qualification_images.length == 0 &&
        this.brandInfo.shop_link == ""
      ) {
        this.$message.error("所选类目必须上传相关资质");
        return false;
      }
      if (type == 1 && this.refuseReason) {
        this.brandAuthClick(type);
      }
      if (type == 1 && !this.refuseReason) {
        this.$message.error("请输入拒绝理由");
        return false;
      }
      if (type == 2) {
        this.$confirm("确定审核通过该品牌吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          this.brandAuthClick(type);
        });
      }
    },
    async brandAuthClick(type) {
      let req = JSON.parse(JSON.stringify(this.brandInfo));
      req.brand_auth_status = type;
      req.refuse_reason = this.refuseReason;
      this.$refs.brandForm.validate(async ok => {
        if (ok) {
          let res = await this.$api.verifyBrandAuth(req);
          if (res.error_code == 0) {
            this.$message.info(type == 1 ? "已拒绝" : "已通过");
            this.detailDg = false;
            this.refuseDg = false;
            this.queryList();
          }
        }
      });
    },
    checkClick(data) {
      this.brandInfo = JSON.parse(JSON.stringify(data));
      if (this.brandInfo.brand_auth_status == 5) {
        this.allDisabled = true;
        this.casDisabled = true;
      } else {
        this.allDisabled = false;
        this.casDisabled = false;
      }
      this.getAssociatedCompany();
      if (this.brandInfo.brand_auth_expired_date == "0001-01-01") {
        this.brandInfo.brand_auth_expired_date = "";
      }
      if (!this.brandInfo.brand_auth_images) {
        this.brandInfo.brand_auth_images = [];
      }
      if (this.$refs.brandForm) {
        this.$refs.brandForm.clearValidate();
      }
      if (!this.brandInfo.category_list) {
        this.brandInfo.category_list = [];
      }
      if (this.brandInfo.auth_level == 2) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      this.detailDg = true;
    },
    async getAssociatedCompany() {
      let req = {
        brand_id: this.brandInfo.brand_id,
        page_id: this.page_id,
        page_size: this.page_size
      };
      let res = await this.$api.getAssociatedCompany(req);
      if (res.error_code == 0) {
        this.innerList = res.data.list || [];
        this.innerCount = res.data.count;
      }
    },
    async initOptions() {
      let req = {
        parent_id: 0
      };
      let res = await this.$api.getBrandAuthCategory(req);
      if (res.error_code == 0 && Array.isArray(res.data)) {
        res.data = res.data.map(item => ({
          ...item
        }));
        this.cascaderOptions = await this.loadOptions(res.data || []);
        this.detailDg = true;
      }
    },
    async loadOptions(category) {
      let array = [];
      for (let i = 0; i < category.length; i++) {
        if (
          category[i].child_count > 0 &&
          this.category_array.includes(category[i].id)
        ) {
          let req = {
            parent_id: category[i].id
          };
          let res = await this.$api.getBrandAuthCategory(req);
          if (res.error_code == 0 && Array.isArray(res.data)) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].child_count == 0) {
                res.data[i].leaf = true;
              } else {
                res.data[i].leaf = false;
              }
            }
            category[i].children = await this.loadOptions(res.data);
          }
        }
        array.push(category[i]);
      }
      return array;
    },
    async relieve() {
      let req = {
        sponsor_id: this.brandInfo.sponsor_id,
        brand_auth_id: this.brandInfo.brand_auth_id
      };
      let res = await this.$api.removeBrandAuth(req);
      if (res.error_code == 0) {
        this.$message.success("授权解除成功");
        this.removeDg = false;
        this.detailDg = false;
        this.queryList();
      }
    },
    //页码变更
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    innerChange(current) {
      this.page_id = current;
      this.getAssociatedCompany();
    },
    async queryList() {
      let req = this.$initReq(this.search);
      let res = await this.$api.brandAuthList(req);
      if (res.error_code == 0) {
        this.list = res.data.brand_auth || [];
        this.total = res.data.count;
      }
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
