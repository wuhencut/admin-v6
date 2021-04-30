<template>
  <div class="cp-kill">
    <div class="title">追杀博主</div>
    <el-form>
      <el-form-item label="请输入博主名单:">
        <el-input
          v-model="input"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 20 }"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="submitBtnClick"
          :disabled="input.trim() == ''"
          type="primary"
          >确认提交</el-button
        >
        <el-button @click="input = ''">清空表单</el-button>
      </el-form-item>
    </el-form>
    <div class="content">
      <div class="title">输入格式 名字用+换行 示例如下:</div>
      <p>
        小柚子是壮家妹子<br />JessLaoban<br />吃吃吃成美少女<br />小宇winnie吃喝玩乐
      </p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: ""
    };
  },
  methods: {
    async submitBtnClick() {
      let cpNameList = this.input.split("\n");
      let trimList = [];
      //去空格  处理名单
      for (let i = 0; i < cpNameList.length; i++) {
        if (cpNameList[i].trim()) {
          trimList.push(cpNameList[i].trim());
        }
      }
      let req = { user_name_list: trimList };
      let res = await this.$api.killerCpList(req);
      if (res.error_code == 0) {
        this.$message.success("追杀程序已启动");
      } else {
        this.$message.error("接口请求失败,@双哥");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cp-kill {
  padding: 30px;
  background: #fff;
  > .title {
    font-weight: bold;
  }
  .content {
    > .title {
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
}
</style>
