<template>
  <div class="config-edit">
    <div class="title">
      <div class="title-close">
        <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()"
          >返回</el-button
        >
      </div>
      <div class="title-text">编辑配置文件</div>
    </div>
    <el-form inline>
      <el-form-item>
        <el-input
          v-model="name"
          :disabled="$route.query.name && $route.query.name != ''"
        >
          <template slot="prepend"
            >文件名:</template
          >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="saveBtnClick"
          :disabled="!isJson || !name"
          type="primary"
          icon="el-icon-check"
          >保存配置</el-button
        >
        <el-button @click="$router.go(-1)" icon="el-icon-close">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- code -->
    <div class="code">
      <div class="code-title">
        Schema json格式{{ isJson ? "正确" : "错误" }}
      </div>
      <div class="code-mirror">
        <codemirror
          ref="jsonSchema"
          v-model="JSONSchema"
          :options="editorOptions"
        ></codemirror>
      </div>
    </div>
    <!-- /code -->

    <div class="content">
      <div class="title">JSONSchema格式参考</div>
      <p>1/ type object 必须包含 properties</p>
      <p>2/ type string 可选title</p>
      <p>3/ type img 可选 title</p>
      <p>4/ type block 可选 title 编辑html富文本</p>
      <p>5/ type array 必须包含items items的type object 可嵌套</p>
    </div>
  </div>
</template>
<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
export default {
  components: {
    codemirror
  },
  data() {
    return {
      editorOptions: {
        viewportMargin: Infinity,
        mode: { name: "javascript", json: true },
        lineNumbers: true,
        lineWrapping: true,
        indentWithTabs: false,
        tabSize: 2
      },
      name: this.$route.query.name || "",
      JSONSchema: "{}",
      UISchema: {},
      formData: {},
      isJson: true
    };
  },
  watch: {
    //验证格式是否正确
    JSONSchema: function(val) {
      try {
        JSON.parse(val);
        this.isJson = true;
      } catch (e) {
        this.isJson = false;
      }
    }
  },
  mounted() {
    if (this.name) {
      this.getConfig();
    } else {
      let json = {
        title: "配置标题",
        type: "object",
        properties: {
          title: {
            type: "string",
            title: "标题"
          },
          list: {
            type: "array",
            title: "列表",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  title: "姓名"
                },
                img: {
                  type: "string",
                  title: "头像"
                }
              }
            }
          }
        }
      };
      this.JSONSchema = JSON.stringify(json, null, "\t");
    }
  },
  methods: {
    async getConfig() {
      let req = {
        name: this.name
      };
      let res = await this.$api.getSchema(req);
      if (res.error_code == 0) {
        let content = JSON.parse(res.data.content);
        this.JSONSchema = JSON.stringify(content.JSONSchema, null, "\t");
        this.UISchema = content.UISchema;
        this.formData = content.formData;
      }
    },
    async saveBtnClick() {
      let req = {
        name: this.name,
        content: JSON.stringify({
          JSONSchema: JSON.parse(this.JSONSchema),
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
<style>
.config-edit .CodeMirror {
  height: auto !important;
}
.config-edit .CodeMirror-scroll {
  height: auto !important;
  min-height: 300px;
}
</style>

<style lang="less" scoped>
.config-edit {
  background: #fff;
  padding: 30px;
  .title {
    display: flex;
    line-height: 40px;
    margin-bottom: 20px;
    > .title-text {
      font-weight: bold;
      flex: 1;
      padding-left: 30px;
    }
  }
  .code {
    height: auto;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    .code-title {
      padding: 20px;
      background: #f7f7f7;
      border-bottom: 1px solid #dcdfe6;
    }
    .code-mirror {
      width: 100%;
      height: auto;
    }
  }
  .content {
    margin-top: 30px;
    padding: 30px;
    background: #fff;
    .title {
      font-weight: bold;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 16px;
    }
  }
}
</style>
