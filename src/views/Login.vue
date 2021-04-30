<template>
  <el-container class="page-login">
    <el-header class="flex">
      <div class="logo">
        <img height="30px" src="../../static/img/logo.png" alt="logo" />
      </div>
    </el-header>
    <el-main>
      <el-form size="large">
        <el-form-item>
          <h2 class="form-title">后台登录</h2>
        </el-form-item>
        <el-form-item>
          <el-input v-model="user.email" placeholder="账号/邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="密码"
            type="password"
            v-model="user.password"
            @keyup.enter.native="loginBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="loginBtnClick"
            :disabled="canLogin"
            class="btn-login"
            type="primary"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>© 2019 映兔科技</el-footer>
  </el-container>
</template>
<script>
import md5 from "js-md5";
import env from "../api/env";

export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      defaultRoute: "cpList", //设置默认登录后展示的页面
      authObj: {} //权限对象， 因为后台传过来的是字符串
    };
  },
  computed: {
    //登录按钮可点击
    canLogin() {
      if (this.user.email != "" && this.user.password != "") {
        return false;
      } else {
        return true;
      }
    }
  },
  mounted() {
    sessionStorage.removeItem("auth");
    let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    if (env == "online") {
      userInfo.master = {};
    } else {
      userInfo.test = {};
    }
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  },
  methods: {
    async loginBtnClick() {
      let req = {
        email: this.user.email,
        password: md5(this.user.password)
      };
      let res = await this.$api.login(req);
      if (res.error_code == 0) {
        // 用户信息
        let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
        if (env == "online") {
          userInfo["master"] = {
            user_id: res.data.user_id,
            sid: res.data.ticket,
            email: res.data.email,
            role_id: res.data.admin_role + ""
          };
        } else {
          userInfo["test"] = {
            user_id: res.data.user_id,
            sid: res.data.ticket,
            email: res.data.email,
            role_id: res.data.admin_role + ""
          };
        }
        //存登录信息
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        sessionStorage.setItem("auth", 1); //登录状态 1
        this.$router.push({
          path: "/",
          name: "main"
        });
      } else {
        if (!res.error_description) {
          this.$message.error("用户名或密码不正确");
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.page-login {
  width: 100%;
  height: 100%;
  .el-header {
    background: #333;
    .logo {
      width: 125px;
      height: 60px;
      padding: 15px 0;
      box-sizing: border-box;
      img {
        height: 30px;
      }
    }
  }
  .el-main {
    .el-form {
      width: 300px;
      margin: 0 auto;
      .form-title {
        text-align: center;
        font-size: 18px;
      }
      .btn-login {
        width: 100%;
      }
    }
  }
  .el-footer {
    text-align: center;
    line-height: 60px;
    color: #333;
    font-size: 10px;
  }
}
</style>
