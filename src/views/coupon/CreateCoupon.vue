<template>
  <div class="createCoupon">
    <div>
      <span class="title extra">新建/编辑优惠券</span>
    </div>
    <el-form label-width="110px">
      <div class="content">
        <el-form-item label-width="0">
          <div class="title">基础设置</div>
        </el-form-item>
        <div>
          <el-form-item label="优惠券类型">
            <el-radio-group
              v-model="coupon.type"
              :disabled="disabled"
              @change="changeType"
            >
              <el-radio :label="4">任务返利券</el-radio>
              <el-radio :label="3">无任务返利券</el-radio>
              <el-radio :label="1">普通优惠券</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="优惠券名称">
            <el-input
              v-model="coupon.name"
              maxlength="30"
              show-word-limit
              class="input-500"
            ></el-input>
          </el-form-item>
          <el-form-item label="优惠券总量">
            <el-input-number
              v-model="coupon.total"
              :min="1"
              :max="99999"
              :precision="0"
              :controls="false"
              :placeholder="'1~99999'"
              :disabled="disabled"
            ></el-input-number>
            <span class="span-left">张</span>
          </el-form-item>
          <el-form-item label="补贴方">
            <el-radio-group
              v-model="coupon.subsidy_owner_type"
              :disabled="disabled"
              @change="changeSourceType"
            >
              <el-radio :label="1">商家自费</el-radio>
              <el-radio :label="2" :disabled="coupon.type == 1"
                >运营部门补贴</el-radio
              >
              <el-radio :label="3" :disabled="able || coupon.type == 1"
                >平台补贴</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商家ID" v-if="coupon.subsidy_owner_type == 1">
            <el-input
              class="input-500"
              v-model="coupon.subsidy_owner_id"
              :disabled="disabled"
              maxlength="19"
              @blur="getSponsorName"
            ></el-input>
            <span class="span-left">{{ sponsor_name }}</span>
          </el-form-item>
          <el-form-item
            label="优惠券备注"
            v-show="coupon.subsidy_owner_type == 1"
          >
            <el-input
              v-model="coupon.remark"
              class="input-500"
              maxlength="30"
              show-word-limit
              :disabled="disabled"
            ></el-input>
            <span></span>
          </el-form-item>
          <el-form-item label="适用商品">
            <el-radio-group
              v-model="coupon.production_type"
              @change="changeProductType"
              :disabled="disabled"
            >
              <el-radio :label="2">指定商品</el-radio>
              <el-radio :label="1" :disabled="coupon.subsidy_owner_type !== 1"
                >商家全部商品</el-radio
              >
              <el-radio :label="3" :disabled="coupon.subsidy_owner_type == 1"
                >平台全部商品</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item v-show="coupon.production_type === 2">
            <span style="margin-right:10px">最多999个适用商品</span>
            <el-button @click="check">查看</el-button>
            <el-button @click="uploadID"
              ><i class="el-icon-plus"></i>上传</el-button
            >
          </el-form-item>
          <el-form-item label="支持类型">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="1" disabled>上架售卖</el-checkbox>
              <el-checkbox :label="2" disabled>可晒单返利</el-checkbox>
              <el-checkbox :label="3" disabled>走淘客购买</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
      <div class="content">
        <el-form-item label-width="0">
          <div class="title">优惠设置</div>
        </el-form-item>
        <el-form-item label="叠加限制">
          <el-checkbox-group v-model="coupon.overlay_limit">
            <el-checkbox :label="1" disabled
              >不能和其他优惠券一起使用</el-checkbox
            >
            <el-checkbox :label="2" v-show="coupon.type == 1"
              >不能和返利一起使用</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="订单门槛">
          <el-radio-group
            v-model="coupon.use_type"
            @change="changeUseType"
            :disabled="disabled"
          >
            <el-radio :label="1">无门槛</el-radio>
            <el-radio :label="2">订单满</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="coupon.use_type == 2">
          <el-input
            :disabled="disabled"
            class="input-100"
            v-model="coupon.amount"
            placeholder="1~9999"
          ></el-input>
          <span class="span-left">元</span>
        </el-form-item>
        <el-form-item label="优惠金额">
          <span class="span-right">返利</span
          ><el-input
            :disabled="disabled"
            v-model="coupon.discount_amount"
            class="input-100"
            placeholder="1~9999"
            oninput="value=value.replace(/[^\d.]/g,'')"
          ></el-input>
          <span class="span-left">元</span>
        </el-form-item>
        <el-form-item label="返利任务" v-show="coupon.type == 4">
          <span class="span-right">自定义任务</span
          ><el-input
            :disabled="disabled"
            v-model="coupon.task"
            style="width:300px"
            maxlength="15"
            show-word-limit
          ></el-input>
        </el-form-item>
      </div>
      <div class="content">
        <el-form-item label-width="0">
          <div class="title">发放设置</div>
        </el-form-item>
        <el-form-item label="领取方式">
          <el-radio-group
            v-model="coupon.receive_type"
            :disabled="disabled"
            @change="changeReceiveType"
          >
            <el-radio :label="1">自动领取</el-radio>
            <el-radio :label="2">手动发放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="新老客限制" v-show="coupon.receive_type == 1">
          <el-radio-group
            v-model="checked3"
            :disabled="disabled"
            @change="changePersonType"
          >
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">以下人群可用</el-radio>
            <el-radio :label="2">以下人群不可用</el-radio>
          </el-radio-group>
          <p>
            <el-select
              v-model="value1"
              multiple
              v-show="checked3 === 1 || checked3 === 2"
              :disabled="disabled"
            >
              <el-option label="已买过试用商品" :value="1"></el-option>
              <el-option label="已提交试用商品晒单" :value="2"></el-option>
              <el-option label="已提交试用商品测评" :value="3"></el-option>
            </el-select>
          </p>
        </el-form-item>
        <el-form-item label="使用对象" v-show="coupon.receive_type == 1">
          <el-radio-group
            v-model="checked4"
            :disabled="disabled"
            @change="changeTagType"
          >
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">指定标签可用</el-radio>
            <el-radio :label="2">指定不可用</el-radio>
          </el-radio-group>
          <!-- 标签选择部分 -->
          <p>
            <el-cascader
              v-model="tagArray"
              v-show="checked4 === 1 || checked4 === 2"
              :disabled="disabled"
              :options="options"
              :show-all-levels="false"
              :props="props"
            ></el-cascader>
          </p>
          <!-- 标签选择部分 -->
          <p style="color:#909399">
            符合条件用户打开+登录APP或进入优惠券管理页时自动领取
          </p>
        </el-form-item>
        <el-form-item label="每人可领">
          <el-input-number
            v-model="coupon.limit_count"
            :min="1"
            :max="99999"
            :precision="0"
            :controls="false"
            :placeholder="'1~99'"
          ></el-input-number>
          <span class="span-left">张</span>
        </el-form-item>
        <el-form-item>
          <p style="color:#909399">
            {{
              coupon.receive_type == 1 ? "用户一次领取所有" : "用户一次领一张"
            }}
          </p>
        </el-form-item>
        <el-form-item label="可用时间">
          <span class="span-right">领取后</span>
          <el-input-number
            v-model="coupon.expiration_time"
            :min="1"
            class="input-100"
            :precision="0"
            :controls="false"
          ></el-input-number>
          <span class="span-left">天过期</span>
        </el-form-item>
      </div>
      <div class="content">
        <div style="display:flex; justify-content:flex-end;align-items:center">
          <el-button @click="exitCreate">退出</el-button>
          <el-button type="primary" @click="reminder">保存</el-button>
        </div>
      </div>
    </el-form>
    <el-dialog
      title="优惠券将在即刻生效"
      :visible.sync="reminderDg"
      width="500px"
    >
      <span
        >如补贴方为商家自费或运营补贴，此刻优惠总面+手续费额将从商家或运营账户中冻结。自动领取的优惠券将开始发放。保存后，只有名称，适用商品，每人限领和可用时间可修改。适用商品修改后，被领取的优惠券也会受影响。</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="reminderDg = false">取 消</el-button>
        <el-button type="primary" @click="reminderConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量上传 -->
    <el-dialog title="批量上传" :visible.sync="uploadDg" width="500px">
      <el-form>
        <el-form-item>
          <span>每个商品ID换行，excel粘贴自动换行，错误的ID会被删除</span>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            v-model="production_ids"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDg = false">取 消</el-button>
        <el-button type="primary" @click="uploadConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看部分商品的列表 -->
    <el-dialog title="适用商品" :visible.sync="productDg" width="600px">
      <el-table :data="productList" style="width: 100%" height="600" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品信息" width="200">
          <template slot-scope="scope">
            <p>{{ scope.row.title }}</p>
            <p>{{ scope.row.price }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="production_id" label="商品ID" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteID(scope.row.production_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="productDg = false">取 消</el-button>
        <el-button type="primary" @click="productDgfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import getUserInfo from "../../api/getUserInfo";
export default {
  data() {
    return {
      userInfo: getUserInfo(),
      props: {
        multiple: true,
        value: "id",
        label: "name"
      },
      able: false,
      disabled: false,
      checkList: [2], //支持的上架类型
      checked3: 0,
      checked4: 0,
      sponsor_name: "",
      options: [], //标签数组
      value1: [],
      tagArray: [],
      productList: [], //展示用的商品列表
      reminderDg: false,
      uploadDg: false,
      productDg: false,
      production_ids: "", //批量查询商品Id
      coupon: {
        name: "",
        type: 4,
        total: undefined,
        production_type: 2,
        production_list: [],
        use_type: 1,
        amount: "",
        discount_amount: "",
        limit_type: 1,
        limit_count: undefined,
        overlay_limit: [1], //叠加使用 1 不能和其它优惠券一起使用 2 不能和返利一起使用 //防止el-checkbox在初始化的时候报错length undefined
        expiration_time: undefined,
        remark: "",
        task: "",
        customer_limit: {},
        tag_limit: {},
        subsidy_owner_type: 1,
        subsidy_owner_id: "",
        receive_type: 1
      },
      count: 0,
      page_id: 1,
      page_size: 10000
    };
  },
  watch: {
    production_ids(val) {
      if (val == "") {
        this.productList = [];
      }
    }
  },
  mounted() {
    let role_id;
    if (location.href.split("#")[0].indexOf("master") > -1) {
      role_id = JSON.parse(localStorage.getItem("userInfo"))["master"].role_id;
      if (role_id != "1") {
        this.able = true;
      }
    } else {
      role_id = JSON.parse(localStorage.getItem("userInfo"))["test"].role_id;
      if (role_id != "17") {
        this.able = true;
      }
    }
    this.getTagTreeList();
    if (this.$route.query.flag.toString() == "false") {
      this.queryList(this.$route.query.flag);
      this.disabled = true;
    } else {
      this.coupon = {
        name: "",
        type: 4,
        total: undefined,
        production_type: 2,
        production_list: [],
        use_type: 1,
        amount: "",
        discount_amount: "",
        limit_type: 1,
        limit_count: undefined,
        overlay_limit: [1], //叠加使用 1 不能和其它优惠券一起使用 2 不能和返利一起使用
        expiration_time: undefined,
        remark: "",
        task: "",
        customer_limit: {
          value: [],
          type: ""
        },
        tag_limit: {
          value: [],
          type: ""
        },
        subsidy_owner_type: 1,
        subsidy_owner_id: "",
        receive_type: 1
      };
    }
  },
  methods: {
    async queryList() {
      let res = await this.$api.getCouponDetail({
        coupon_id: this.$route.query.id
      });
      if (res.error_code == 0) {
        let result = { ...res.data };
        result.production_list = result.production_list || [];
        result.discount_amount = result.discount_amount / 100;
        result.amount = result.amount / 100;
        result.overlay_limit = result.overlay_limit || [1];
        result.customer_limit.value = result.customer_limit.value || [];
        result.tag_limit.value = result.tag_limit.value || [];
        this.coupon = result;
        this.checked3 =
          this.coupon.customer_limit && this.coupon.customer_limit.type;
        this.checked4 = this.coupon.tag_limit && this.coupon.tag_limit.type;
        if (this.coupon.type == 1 || this.coupon.type == 3) {
          this.checkList = [1, 2];
        } else {
          this.checkList = [2];
        }
        if (
          this.coupon.customer_limit.value.length !== 0 ||
          this.coupon.tag_limit.value.length !== 0
        ) {
          this.value1 = this.coupon.customer_limit.value;
          this.tagArray = this.coupon.tag_limit.value;
        } else {
          this.value1 = [];
          this.tagArray = [];
        }
      }
    },
    //获取标签树
    async getTagTreeList() {
      let req = {
        tag_type: [10, 9, 8, 7, 3, 2, 1]
      };
      let res = await this.$api.userLabelList(req);
      if (res.error_code == 0) {
        res.data.tag_list = JSON.parse(
          JSON.stringify(res.data.tag_list).replace(/son_list/g, "children") //因为树组件的数据要求子节点的节点名为children
        );
        this.options = res.data.tag_list;
      }
    },
    //获取商家名字
    async getSponsorName() {
      if (this.coupon.subsidy_owner_id !== "") {
        let req = {
          sponsor_id: this.coupon.subsidy_owner_id,
          page_id: 1,
          page_size: 10
        };
        let res = await this.$api.sponsorSearch(req);
        if (res.error_code == 0 && res.data.sponsor_user) {
          this.sponsor_name = res.data.sponsor_user[0].company_name || "";
        }
      }
    },
    changeType(val) {
      if (val == 3 || val == 4) {
        this.coupon.task = "";
        this.coupon.overlay_limit = [1];
      }
      if (val == 3 || val == 1) {
        this.checkList = [1, 2];
      } else {
        this.checkList = [2];
      }
      if (val == 1) {
        this.coupon.subsidy_owner_type = 1;
      }
    },
    changeSourceType(val) {
      if (val == 2 || val == 3) {
        this.coupon.subsidy_owner_id = "";
        this.coupon.remark = "";
        this.coupon.production_type = 2;
        this.production_ids = "";
        this.productList = [];
        this.coupon.production_list = [];
      }
    },
    //切换使用门槛
    changeUseType() {
      this.coupon.amount = "";
    },
    //切换新老客限制
    changePersonType() {
      this.value1 = [];
    },
    //切换使用对象
    changeTagType() {
      this.tagArray = [];
    },
    changeProductType() {
      this.production_ids = "";
      this.productList = [];
      this.coupon.production_list = [];
    },
    // //切换映口令
    changeReceiveType() {
      this.checked3 = 0;
      this.checked4 = 0;
      this.value1 = [];
      this.tagArray = [];
    },
    //退出
    exitCreate() {
      this.$router.push({ name: "couponList" });
    },
    // 确定创建优惠券
    async reminderConfirm() {
      this.reminderDg = false;
      let params = { ...this.coupon };
      params.customer_limit = {
        type: this.checked3,
        value: this.value1
      };
      params.tag_limit = {
        type: this.checked4,
        value: this.tagArray
      };
      params.discount_amount = Number(this.coupon.discount_amount) * 100;
      params.amount = Number(this.coupon.amount) * 100;
      // params.expiration_time = this.coupon.expiration_time;
      if (this.sponsor_name !== "" && this.coupon.subsidy_owner_id !== "") {
        params.sponsor_id = this.coupon.subsidy_owner_id;
      } else {
        params.sponsor_id = "0";
      }
      if (this.$route.query.flag == true || this.$route.query.flag == "true") {
        let res = await this.$api.createNewCoupon(this.$initReq(params));
        if (res.error_code == 0) {
          this.$message.success("创建成功");
          this.$router.push({ name: "couponList" });
        }
      } else {
        let req = {
          coupon_id: this.$route.query.id,
          name: this.coupon.name,
          production_type: this.coupon.production_type,
          production_list: this.coupon.production_list,
          limit_type: this.coupon.limit_type,
          limit_count: this.coupon.limit_count,
          expiration_time: this.coupon.expiration_time
        };
        let res = await this.$api.updateCouponDetail(req);
        if (res.error_code == 0) {
          this.$message.success("修改成功");
          this.$router.push({ name: "couponList" });
        }
      }
    },
    //验证表单
    validateForm() {
      if (this.coupon.name == "") {
        this.$message.error("请输入优惠券名称");
        return false;
      }
      if (this.coupon.total == undefined) {
        this.$message.error("请输入优惠券总量");
        return false;
      }
      if (
        this.coupon.subsidy_owner_type == 1 &&
        this.$route.query.flag.toString() == "true"
      ) {
        if (this.sponsor_name == "") {
          this.$message.error("请输入正确的商家ID");
          return false;
        }
        if (this.coupon.remark == "") {
          this.$message.error("请输入优惠券备注");
          return false;
        }
      }
      if (this.coupon.production_type == 2) {
        if (this.coupon.production_list.length == 0) {
          this.$message.error("请选择适用商品");
          return false;
        }
      }

      if (this.coupon.use_type == 2) {
        if (this.coupon.amount == "") {
          this.$message.error("请填写订单门槛");
          return false;
        }
      }
      if (this.coupon.discount_amount == "") {
        this.$message.error("请填写返利金额");
        return false;
      }
      if (this.coupon.type == 4) {
        if (this.coupon.task == "") {
          this.$message.error("请填写自定义任务");
          return false;
        }
      }
      if (this.checked3 == 1 || this.checked3 == 2) {
        if (this.value1.length == 0) {
          this.$message.error("请选择新老客限制范围");
          return false;
        }
      }
      if (this.checked4 == 1 || this.checked4 == 2) {
        if (this.tagArray.length == 0) {
          this.$message.error("请选择使用对象限制范围");
          return false;
        }
      }
      if (this.coupon.limit_count == undefined) {
        this.$message.error("请填写每人可领张数");
        return false;
      }
      if (this.coupon.expiration_time == undefined) {
        this.$message.error("请填写可用时间");
        return false;
      }
      return true;
    },
    deleteID(id) {
      this.productList = this.productList.filter(item => {
        return id !== item.production_id;
      });
      let array = [];
      for (let i in this.productList) {
        array.push(this.productList[i].production_id);
      }
      this.coupon.production_list = array;
      this.production_ids = this.coupon.production_list.join("\n");
    },
    //提示弹框
    reminder() {
      let validate = this.validateForm();
      if (validate) {
        this.reminderDg = true;
      }
    },
    //查看选了的商品
    async check() {
      if (this.coupon.production_list.length !== 0) {
        await this.getProductList();
      }

      this.productDg = true;
    },
    //修改所选商品
    productDgfirm() {
      this.productDg = false;
    },
    uploadID() {
      if (this.productList && this.productList.length !== 0) {
        let array = [];
        for (let i in this.productList) {
          array.push(this.productList[i].production_id);
        }
        this.coupon.production_list = array;
        this.production_ids = this.coupon.production_list.join("\n");
      } else {
        this.production_ids = "";
      }
      this.uploadDg = true;
    },

    async uploadConfirm() {
      this.coupon.production_list = [];
      if (this.production_ids == "") {
        this.coupon.production_list = [];
        this.productList = [];
      } else {
        this.production_ids = this.production_ids.replace(/^\n*/, "");
        this.production_ids = this.production_ids.replace(/\n{2,}/g, "\n");
        this.production_ids = this.production_ids.replace(/\n*$/, "");
        this.coupon.production_list = this.production_ids.split("\n");
        await this.getProductList();
      }
      this.uploadDg = false;
    },
    //批量请求商品进行确认接口
    async getProductList() {
      let req = {
        production_ids: this.coupon.production_list,
        is_filter_status: 1,
        page_id: this.page_id,
        page_size: this.page_size
      };
      let res = await this.$api.getProductionList(req);
      if (res.error_code == 0) {
        this.productList = res.data.list;
        this.count = res.data.count;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.input-500 {
  width: 500px;
}
.input-100 {
  width: 100px;
}
.span-left {
  margin-left: 10px;
}
.span-right {
  margin-right: 10px;
}
.content {
  margin-top: 20px;
  padding: 20px 10px;
  background: white;
}
.title {
  width: 110px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 0 20px 0 0;
  box-sizing: border-box;
}
.extra {
  width: 180px;
}
</style>
