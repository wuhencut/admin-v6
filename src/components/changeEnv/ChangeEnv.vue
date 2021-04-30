<template>
  <div class="dev-change-env" v-if="env != 'online'">
    <div class="change-button" @click="dialog = true">
      切换测试环境: {{ env }}
    </div>
    <el-dialog title="选择测试环境" width="600px" :visible.sync="dialog">
      <div class="dev-item pannel" @click="itemClick('dev')">
        <p>测试环境1:</p>
        <p>http://dev.passport.test.collectivedynamic.com:30000</p>
        <p>http://dev.admin.test.collectivedynamic.com:30000</p>
      </div>
      <div class="dev-item pannel" @click="itemClick('dev2')">
        <p>测试环境2:</p>
        <p>http://dev2.passport.test.collectivedynamic.com:30000</p>
        <p>http://dev2.admin.test.collectivedynamic.com:30000</p>
      </div>
      <div class="dev-item pannel" @click="itemClick('dev3')">
        <p>测试环境3</p>
        <p>http://dev3.passport.test.collectivedynamic.com:30000</p>
        <p>http://dev3.admin.test.collectivedynamic.com:30000</p>
      </div>
      <div class="dev-item pannel" @click="itemClick('dev4')">
        <p>测试环境4</p>
        <p>http://dev4.passport.test.collectivedynamic.com:30000</p>
        <p>http://dev4.admin.test.collectivedynamic.com:30000</p>
      </div>
      <div class="dev-item pannel" @click="itemClick('master')">
        <p>test-master:</p>
        <p>http://master.passport.test.collectivedynamic.com:30000</p>
        <p>http://master.admin.test.collectivedynamic.com:30000</p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import env from "../../api/env";
export default {
  data() {
    return {
      env: env,
      dialog: false
    };
  },
  methods: {
    itemClick(item) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.test = {};
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("in2env", item);
      this.dialog = false;
      if (this.$route.path !== "/login") {
        this.$router.push("/login");
      }
      location.reload();
    }
  }
};
</script>
<style lang="less" scoped>
.dev-item {
  border: 1px solid #eeeeee;
  cursor: pointer;
  & + .dev-item {
    margin-top: 10px;
  }
  &:hover {
    border-color: #4a49cc;
  }
}
.dev-change-env {
  position: fixed;
  z-index: 3000;
  left: 10px;
  bottom: 10px;

  > .change-button {
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 10px;
    cursor: pointer;
  }
}
</style>
