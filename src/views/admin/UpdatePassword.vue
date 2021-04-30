<template>
  <div class="update-password">
    <div class="title">修改密码</div>
    <el-form ref="form" :model="user" :rules="rules">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="user.oldPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="user.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码确认" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitClick">确认提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  data() {
    let validatorConfirm = (rule, value, callback) => {
      if (value != this.user.newPassword) {
        return callback(new Error("确认密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "密码不少于6位", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: validatorConfirm, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitClick() {
      this.$refs.form.validate(async ok => {
        if (ok) {
          let req = {
            oldPassword: md5(this.user.oldPassword),
            password: md5(this.user.newPassword)
          };
          let res = await this.$api.updataPassword(req);
          if (res.error_code == 0) {
            this.$message.success("修改密码成功");
            this.$router.push({
              name: "login"
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.update-password {
  padding: 30px;
  background: #fff;
  .title {
    font-weight: bold;
  }
  .el-form {
    width: 400px;
  }
}
</style>
