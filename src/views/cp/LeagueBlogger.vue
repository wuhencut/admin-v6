<template>
  <div class="league-page">
    <el-form inline>
      <el-form-item>
        <el-input
          placeholder="映兔ID"
          v-model.trim="search.cp_id"
          maxlength="19"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="映兔昵称"
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="签约手机"
          v-model.trim="search.sign_phone_number"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <blogger-select
          isOut
          v-model="search.operator_id"
          @change="searchBtnClick"
        ></blogger-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.collaborate_status" @change="searchBtnClick">
          <el-option label="合作状态" value></el-option>
          <el-option :value="1" label="进行中"></el-option>
          <el-option :value="2" label="已中止"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.yunzhanghu_status" @change="searchBtnClick">
          <el-option label="云账户状态" value></el-option>
          <el-option :value="1" label="待签约"></el-option>
          <el-option :value="2" label="进行中"></el-option>
          <el-option :value="3" label="已中止"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchBtnClick"
          >搜索</el-button
        >
        <el-button icon="el-icon-search" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          class="export-btn"
          type="primary"
          @click="transform(false, 1)"
          >添加</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="映兔ID" prop="cp_id"></el-table-column>
      <el-table-column label="映兔昵称" prop="cp_nickname"></el-table-column>
      <el-table-column
        label="签约手机"
        prop="sign_phone_number"
      ></el-table-column>
      <el-table-column label="合作状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.collaborate_status == 1"
            >进行中</el-tag
          >
          <el-tag type="warning" v-if="scope.row.collaborate_status == 2"
            >已中止</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="负责人"
        ><template slot-scope="scope"
          ><p>{{ allAdmin[scope.row.operator_id] }}</p></template
        ></el-table-column
      >
      <el-table-column label="云账户状态" prop="yunzhanghu_status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.yunzhanghu_status == 1">待签约</el-tag>
          <el-tag type="success" v-if="scope.row.yunzhanghu_status == 2"
            >进行中</el-tag
          >
          <el-tag type="warning" v-if="scope.row.yunzhanghu_status == 3"
            >已中止</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="transform(scope.row, 1)"
            >查看</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.collaborate_status == 1"
            @click="stop(scope.row.cp_id)"
            >中止</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.collaborate_status == 2"
            @click="recover(scope.row.cp_id)"
            >恢复</el-button
          >
          <el-button
            type="text"
            v-if="
              scope.row.collaborate_status == 2 &&
                authList.indexOf('1603850706') > -1
            "
            @click="transform(scope.row, 2)"
            >变更</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-show="list.length">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        :current-page="search.page_id"
      ></el-pagination>
    </div>
    <!-- 添加/查看/变更 -->
    <el-dialog title="查看详情" :visible.sync="dialog" width="800px">
      <el-form
        width="90px"
        label-position="left"
        :rules="rules"
        ref="currItemForm"
        :model="currItem"
      >
        <p style="font-size:16px;margin-bottom:15px"><b>基本信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="映兔ID：" label-width="100px" prop="cp_id">
              <el-input
                style="width:200px"
                v-model.trim="currItem.cp_id"
                placeholder="请输入"
                @blur="getBloggerMessage"
                maxlength="19"
                :disabled="nameDisabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称：" label-width="90px">
              <el-input
                style="width:200px"
                v-model="nickname"
                disabled
                placeholder="自动填入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="签约手机："
              label-width="100px"
              prop="sign_phone_number"
            >
              <el-input
                style="width:200px"
                v-model="currItem.sign_phone_number"
                placeholder="请输入，用于接收云账户签约短信"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="负责人："
              label-width="90px"
              prop="operator_id"
            >
              <blogger-select v-model="currItem.operator_id"></blogger-select>
            </el-form-item>
          </el-col>
        </el-row>
        <p style="font-size:16px;margin-bottom:15px"><b>云账户信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="地区：" label-width="90px">
              <el-radio-group v-model="currItem.region" :disabled="disabled">
                <el-radio :label="0">中国大陆</el-radio>
                <el-radio :label="1">港澳台/海外</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款方式：" label-width="90px">
              <el-radio-group
                v-model="currItem.payment_method"
                :disabled="disabled"
              >
                <el-radio :label="1">银行卡</el-radio>
                <el-radio :label="2">支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="收款户名："
              label-width="100px"
              prop="payee_name"
            >
              <el-input
                style="width:200px"
                v-model="currItem.payee_name"
                placeholder="收款人真实姓名"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="收款账号："
              label-width="100px"
              prop="payee_account"
            >
              <el-input
                style="width:200px"
                v-model="currItem.payee_account"
                placeholder="收款人银行卡账号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="身份证号："
              label-width="100px"
              prop="payee_id"
            >
              <el-input
                style="width:200px"
                v-model="currItem.payee_id"
                placeholder="收款人身份证号"
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加/查看/变更 -->
    <el-dialog :visible.sync="statusDg" width="300px" center>
      <span style="font-size:16px" v-if="this.status == 1"
        ><b>确定中止该博主联盟合作？</b></span
      >
      <span style="font-size:16px" v-if="this.status == 2"
        ><b>确定恢复该博主联盟合作？</b></span
      >
      <p style="margin-top:10px" v-if="this.status == 1">
        博主的云账户结算将于下下月底中止！
      </p>
      <p style="margin-top:10px" v-if="this.status == 2">
        博主的云账户结算将恢复正常！
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDg = false">取 消</el-button>
        <el-button type="primary" v-if="this.status == 1" @click="stopConfirm"
          >确 定</el-button
        >
        <el-button
          type="primary"
          v-if="this.status == 2"
          @click="recoverConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BloggerSelect from "../../components/BloggerSelect";
export default {
  components: {
    BloggerSelect
  },
  data() {
    return {
      list: [],
      isNew: false,
      statusDg: false,
      status: "", //控制弹窗的显示内容
      cp_id: "", //用来传递参数
      disabled: false, //用来控制是否能编辑
      nameDisabled: false, //控制映兔ID不能编辑
      total: 0,
      search: {
        cp_id: "",
        cp_nickname: "",
        sign_phone_number: "",
        operator_id: "",
        collaborate_status: "",
        yunzhanghu_status: "",
        page_id: 1,
        page_size: 10
      },
      nickname: "",
      currItem: {
        cp_id: "",
        sign_phone_number: "",
        operator_id: "",
        collaborate_status: "",
        yunzhanghu_status: "",
        region: 0,
        payment_method: 1
      },
      currItemTemplt: {
        cp_id: "",
        sign_phone_number: "",
        operator_id: "",
        collaborate_status: "",
        yunzhanghu_status: "",
        region: 0,
        payment_method: 1
      },
      dialog: false,
      rules: {
        cp_id: [{ required: true, message: "请输入映兔ID", trigger: "blur" }],
        sign_phone_number: [
          {
            required: true,
            message: "请输入签约手机号",
            trigger: "blur"
            // pattern: this.disabled == true ? null : /^[0-9]+$/
          }
        ],
        operator_id: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "change"
          }
        ],
        payee_name: [
          {
            required: true,
            message: "请输入收款户名",
            trigger: "blur"
          }
        ],
        payee_account: [
          {
            required: true,
            message: "请输入收款账号",
            trigger: "blur"
          }
        ],
        payee_id: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: "blur"
            // pattern: /^1[34578]\d{9}$/
          }
        ]
      }
    };
  },
  watch: {
    "currItem.cp_id"() {
      if (this.isNew == true) {
        this.nickname = "";
        this.currItem.sign_phone_number = "";
      } else {
        this.nickname = this.currItem.cp_nickname;
      }
    }
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    },
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    //切换页码
    currentChange(current) {
      this.search.page_id = current;
      this.queryList();
    },
    async queryList() {
      let res = await this.$api.getSignedBloggerList(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    reset() {
      this.search = {
        cp_id: "",
        cp_nickname: "",
        sign_phone_number: "",
        operator_id: "",
        collaborate_status: "",
        yunzhanghu_status: "",
        page_id: 1,
        page_size: 10
      };
      this.searchBtnClick();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    getBloggerMessage() {
      this.getBloggerName();
    },
    //自动根据id键入映兔名搜索
    async getBloggerName() {
      if (this.currItem.cp_id == "") {
        return false;
      }
      let req = {
        cp_id: this.currItem.cp_id || "0"
      };
      let res = await this.$api.userSearch(req);
      if (res.error_code == 0) {
        if (res.data) {
          this.nickname = res.data.cp_nickname;
          this.currItem.sign_phone_number = res.data.phone;
        }
      }
    },
    stop(id) {
      this.cp_id = id;
      this.status = 1;
      this.statusDg = true;
    },
    recover(id) {
      this.cp_id = id;
      this.status = 2;
      this.statusDg = true;
    },
    async stopConfirm() {
      let res = await this.$api.stopContract({ cp_id: this.cp_id });
      if (res.error_code == 0) {
        this.$message.success("合作中止成功");
      }
      this.statusDg = false;
      this.searchBtnClick();
    },
    async recoverConfirm() {
      let res = await this.$api.resumeContract({ cp_id: this.cp_id });
      if (res.error_code == 0) {
        this.$message.success("合作恢复成功");
      }
      this.statusDg = false;
      this.searchBtnClick();
    },
    async transform(data, ischange) {
      this.dialog = true;
      this.disabled = false;
      this.nameDisabled = false;
      if (!data) {
        this.isNew = true;
        this.currItem = JSON.parse(JSON.stringify(this.currItemTemplt));
      } else {
        this.isNew = false;
        this.nameDisabled = true;
        let res = await this.$api.getSignedDetail({ cp_id: data.cp_id });
        if (res.error_code == 0) {
          this.currItem = JSON.parse(JSON.stringify(res.data)) || {};
        }
        if (ischange == 1) {
          if (data.collaborate_status !== 1 || data.yunzhanghu_status !== 1) {
            this.currItem.is_change = false;
            this.disabled = true;
          }
        } else {
          this.currItem.is_change = true;
          this.disabled = false;
        }
      }
    },
    async submit() {
      this.$refs.currItemForm.validate(async ok => {
        if (ok) {
          if (this.isNew == true) {
            let res = await this.$api.addSignedBlogger(this.currItem);
            if (res.error_code == 0) {
              this.$message.success("添加成功");
            }
            this.dialog = false;
            this.searchBtnClick();
          } else {
            let res = await this.$api.updateSignedDetail(this.currItem);
            if (res.error_code == 0) {
              this.$message.success("修改成功");
            }
            this.dialog = false;
            this.searchBtnClick();
          }
        }
      });
    }
  }
};
</script>
