<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">保证金用途</el-col>
      <el-col :span="6"
        ><p v-show="info.deposit_type == 1">品牌协议入驻</p></el-col
      >
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">保证金金额</el-col>
      <el-col :span="6">
        <p>{{ info.amount }}</p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">状态</el-col>
      <el-col :span="6">
        <p v-show="info.status == 1">已支付</p>
        <p v-show="info.status == 2">待退款</p>
        <p v-show="info.status == 3">已退款</p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">支付方式</el-col>
      <el-col :span="6">
        <p v-show="info.payments == 1">支付宝</p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">支付宝订单号</el-col>
      <el-col :span="6">{{ info.trade_no }}</el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {};
  }
};
</script>
