<template>
  <div style="detail-page">
    <el-button type="text" @click="dialog = true">查看</el-button>
    <el-dialog
      title="查看详情"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      append-to-body
      width="800px"
    >
      <el-form width="90px" label-position="left">
        <p style="font-size:16px;margin-bottom:15px"><b>基本信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="映兔ID：" label-width="85px">
              <span>{{ settleMessage.cp_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称：" label-width="85px">
              <span>{{ settleMessage.cp_nickname }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="签约手机：" label-width="85px">
              <el-input
                style="width:200px"
                disabled
                v-model="settleMessage.sign_phone_number"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人：" label-width="85px">
              <blogger-select
                v-model="settleMessage.operator_id"
                :disabled="disabled"
              ></blogger-select>
            </el-form-item>
          </el-col>
        </el-row>
        <p style="font-size:16px;margin-bottom:15px"><b>云账户信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="地区：" label-width="85px">
              <p v-if="settleMessage.region == 0">中国大陆</p>
              <p v-if="settleMessage.region == 1">中国港澳台地区/海外</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款方式：" label-width="85px">
              <p v-if="settleMessage.payment_method == 1">银行卡</p>
              <p v-if="settleMessage.payment_method == 2">支付宝</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收款户名：" label-width="85px">
              <el-input
                style="width:200px"
                disabled
                v-model="settleMessage.payee_name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款账号：" label-width="85px">
              <el-input
                style="width:200px"
                disabled
                v-model="settleMessage.payee_account"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号：" label-width="85px">
              <el-input
                style="width:200px"
                disabled
                v-model="settleMessage.payee_id"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BloggerSelect from "../../../components/BloggerSelect";
export default {
  components: {
    BloggerSelect
  },
  props: {
    settleMessage: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      disabled: true,
      dialog: false
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  }
};
</script>
