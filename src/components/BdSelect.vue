<template>
  <div class="admin-select">
    <el-select v-model="current" @change="change" :disabled="disabled">
      <el-option v-if="isAll" label="BD负责人" value=""></el-option>
      <!-- <el-option v-if="isAll && !isNew" label="BD负责人" value="0"></el-option> -->
      <el-option v-if="noBd" value="0" label="无BD负责人"></el-option>
      <el-option
        v-for="item in salesmanList"
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
    // isNew: Boolean, // 兼容新老版本
    disabled: Boolean,
    noBd: Boolean // 是否展示【无BD负责人】选项
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
    salesmanList() {
      let salesmanList = [];
      let adminList = this.$store.getters.getAdminList;
      for (let i = 0; i < adminList.length; i++) {
        if (
          (adminList[i].admin_role == "销售" ||
            adminList[i].admin_role == "销售主管" ||
            adminList[i].admin_role == "销售组长") &&
          adminList[i].status == 1
        ) {
          salesmanList.push({
            id: adminList[i].user_id,
            label: adminList[i].nickname
          });
        }
      }
      return salesmanList;
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
