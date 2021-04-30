<template>
  <div class="page">
    <el-button
      v-if="sponsor.account_status == 1"
      type="text"
      @click="frozenBtnClick(2)"
      >冻结</el-button
    >
    <el-button
      v-if="sponsor.account_status == 2"
      type="text"
      @click="frozenBtnClick(1)"
      >解冻</el-button
    >
  </div>
</template>
<script>
export default {
  name: "Freeze",
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
      modify: {}
    };
  },
  created() {},
  methods: {
    //冻结账户
    frozenBtnClick(val) {
      this.modify = {
        sponsor_id: this.sponsor.sponsor_id,
        company_name: this.sponsor.campany_name,
        email: this.sponsor.email,
        phone: this.sponsor.phone,
        user_name: this.sponsor.contact_name,
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
      this.modify.status = val;
      this.updateStatus();
    },
    //修改状态
    updateStatus() {
      let message =
        this.modify.status == 2 ? "确定冻结账户吗？" : "确定解冻账户吗？";
      this.$confirm(message, "操作提示")
        .then(async () => {
          let res = await this.$api.sponsorModify(this.modify);
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.$emit("update");
          }
        })
        .catch(() => {
          return false;
        });
    }
  }
};
</script>
