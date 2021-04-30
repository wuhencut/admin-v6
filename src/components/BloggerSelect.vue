<template>
  <div class="blogger-select">
    <el-select v-model="current" @change="change" :disabled="disabled">
      <el-option v-if="isOut" label="全部博主运营" value=""></el-option>
      <!-- <el-option v-if="isOut" label="全部博主运营" value="0"></el-option> -->
      <el-option
        v-for="item in bloggerList"
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
    disabled: Boolean,
    value: String,
    isOut: Boolean,
    isExit: Boolean // 兼容新老版本
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
    bloggerList() {
      let bloggerList = [];
      let adminList = this.$store.getters.getAdminList;
      for (let i = 0; i < adminList.length; i++) {
        if (
          (adminList[i].admin_role == "AE" ||
            adminList[i].admin_role == "管理员") &&
          adminList[i].status == 1
        ) {
          bloggerList.push({
            id: adminList[i].user_id,
            label: adminList[i].nickname
          });
        }
      }
      return bloggerList;
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
