<template>
  <el-form class="components-schema">
    <div v-for="(item, key) in model.properties" :key="key">
      <!--string类型-->
      <div v-if="item.type == 'string'">
        <el-form-item :label="item.title">
          <el-input v-model="data[key]"></el-input>
        </el-form-item>
      </div>
      <!--/string-->

      <!--img类型-->
      <div v-if="item.type == 'img'">
        <el-form-item :label="item.title">
          <upload-img v-model="data[key]"></upload-img>
        </el-form-item>
      </div>
      <!--/img-->
      <!--布尔-->
      <div v-if="item.type == 'bollean'">
        <el-form-item :label="item.title">
          <el-switch
            v-model="data[key]"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </div>
      <!--/布尔-->

      <!--block-->
      <div v-if="item.type == 'block'">
        <div class="block">
          <div class="block-label">{{ item.title }}</div>
          <editor v-model="data[key]"></editor>
        </div>
      </div>
      <!--/block-->

      <!--array类型-->
      <div class="array" v-if="item.type == 'array'">
        <div class="array-title">
          {{ item.title }}
          <el-button style="float:right;" @click="addBtnClick(item, key)"
            >添加项</el-button
          >
        </div>
        <div class="array-box" v-for="(array, index) in data[key]" :key="index">
          <div class="array-box-left">
            <schema-form :model="item.items" :data="array"></schema-form>
          </div>
          <div class="array-box-right">
            <el-button
              :disabled="index > data[key].length - 2"
              @click="move(index, index + 1, key)"
              >下移
            </el-button>
            <el-button
              :disabled="index < 1"
              @click="move(index, index - 1, key)"
              >上移</el-button
            >
            <el-button @click="removeBtnClick(index, key)">删除</el-button>
          </div>
        </div>
      </div>
      <!--/array类型-->
    </div>
  </el-form>
</template>
<script>
import UploadImg from "./UploadImg";
import Editor from "./Editor";

export default {
  name: "schema-form",
  components: {
    UploadImg,
    Editor
  },
  props: {
    model: {
      //JSONSchema
      type: Object
    },
    data: {
      //formData
      type: Object
    }
  },
  methods: {
    //添加列表项
    addBtnClick(item, key) {
      if (!this.data[key]) {
        this.$set(this.data, key, []);
      }
      var obj = {};
      for (var val in item.items.properties) {
        obj[val] = "";
      }
      this.data[key].unshift(obj);
    },
    //删除项
    removeBtnClick(index, key) {
      this.data[key].splice(index, 1);
    },
    //移动
    move(firstIndex, lastIndex, key) {
      var firstItem = this.data[key][firstIndex];
      var lastItem = this.data[key][lastIndex];
      this.data[key].splice(firstIndex, 1, lastItem);
      this.data[key].splice(lastIndex, 1, firstItem);
    }
  }
};
</script>
<style lang="less" scoped>
.components-schema {
  .block {
    margin-bottom: 22px;
    .block-label {
      line-height: 40px;
      font-size: 14px;
      color: #606266;
    }
  }
  .array {
    .array-title {
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }
    .array-box {
      padding: 10px;
      display: flex;
      transition: background 0.3s;
      &:hover {
        background: #eee;
      }
      .array-box-left {
        flex: 1;
      }
      .array-box-right {
        padding-top: 40px;
        padding-left: 10px;
      }
    }
  }
}
</style>
