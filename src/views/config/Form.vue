<template>
  <div class="config-form">
    <div class="title">
      <div class="title-close">
        <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()"
          >返回</el-button
        >
      </div>
      <div class="title-text">{{ JSONSchema.title }}</div>
    </div>
    <schema-form :model="JSONSchema" :data="formData"></schema-form>
    <div class="footer-btns">
      <el-button @click="submitBtnClick" type="primary">提交保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>
<script>
import SchemaForm from "../../components/SchemaForm";
export default {
  components: {
    SchemaForm
  },
  data() {
    return {
      name: this.$route.query.name,
      JSONSchema: {},
      UISchema: {},
      formData: {}
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      let req = {
        name: this.name
      };
      let res = await this.$api.getSchema(req);
      if (res.error_code == 0) {
        let content = JSON.parse(res.data.content);
        this.JSONSchema = content.JSONSchema;
        this.UISchema = content.UISchema;
        this.formData = content.formData;
      } else {
        this.$message.error(res.msg);
      }
    },
    async submitBtnClick() {
      let req = {
        name: this.name,
        content: JSON.stringify({
          JSONSchema: this.JSONSchema,
          UISchema: this.UISchema,
          formData: this.formData
        })
      };
      let res = await this.$api.createSchema(req);
      if (res.error_code == 0) {
        this.$message.success("保存成功");
        this.$router.back();
      } else {
        this.$message.error("保存失败");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.config-form {
  padding: 30px;
  background: #fff;
  > .title {
    display: flex;
    line-height: 40px;
    > .title-text {
      font-weight: bold;
      flex: 1;
      padding-left: 30px;
    }
  }
  > .footer-btns {
    margin-top: 20px;
  }
}
</style>
