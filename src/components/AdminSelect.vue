<template>
  <div class="admin-select">
    <el-select v-model="current" @change="change">
      <el-option v-if="isAll && isNew" label="所有运营" value=""></el-option>
      <el-option v-if="isAll && !isNew" label="所有运营" value="0"></el-option>
      <el-option
        v-for="item in operatorList"
        :value="item.id"
        :label="item.label"
        :key="item.id"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    isAll: Boolean,
    isNew: Boolean, // 兼容新老版本
    isSponsorOperator: Boolean // 是否商家运营  运营权限细分
  },
  data() {
    return {
      current: this.value
    };
  },
  watch: {
    value(val) {
      this.current = val;
    }
  },
  computed: {
    operatorList() {
      let operatorList = [];
      let adminList = this.$store.getters.getAdminList;
      for (let i = 0; i < adminList.length; i++) {
        // 商家运营和 运营主管 星选主管有权限给商家加减信用分
        if (adminList[i].status == 1 && this.isSponsorOperator) {
          if (
            adminList[i].admin_role == "运营主管" ||
            adminList[i].admin_role == "商家运营" ||
            adminList[i].admin_role == "星选主管"
          ) {
            operatorList.push({
              id: adminList[i].user_id,
              label: adminList[i].nickname
            });
          }
        }
        // 有权限的所有运营
        if (adminList[i].status == 1 && !this.isSponsorOperator) {
          if (
            adminList[i].admin_role == "运营" ||
            adminList[i].admin_role == "运营主管" ||
            adminList[i].admin_role == "商家运营" ||
            adminList[i].admin_role == "星选主管"
          ) {
            operatorList.push({
              id: adminList[i].user_id,
              label: adminList[i].nickname
            });
          }
        }
      }
      return operatorList;
    }
  },
  methods: {
    change() {
      this.$emit("input", this.current);
      this.$emit("change");
    }
  }
};
</script>
<style lang="less" scoped>
.admin-select {
  display: inline-block;
}
</style>
