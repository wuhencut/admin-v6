<template>
  <div class="height-light">
    <div class="height-light-item" v-for="(item, index) in value" :key="index">
      <el-input
        :maxlength="20"
        style="width:500px;"
        v-model="value[index]"
        :disabled="disabled"
      ></el-input
      ><el-button
        @click="removeBtnClick(index)"
        style="margin-left:20px;"
        type="text"
        :disabled="disabled"
      >
        删除
      </el-button>
      <span class="height-light-length">{{ value[index].length }}/20</span>
    </div>
    <div class="height-light-add" v-if="value.length < 5">
      <el-button @click="addBtnClick" :disabled="disabled">
        <i class="el-icon-plus"></i>
        添加指引
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    disabled: Boolean
  },
  methods: {
    addBtnClick() {
      this.value.push("");
    },
    removeBtnClick(index) {
      this.value.splice(index, 1);
    }
  }
};
</script>
<style lang="less" scoped>
.height-light {
  width: 600px;
  > .height-light-item {
    margin-bottom: 16px;
    position: relative;
    .height-light-length {
      position: absolute;
      right: 130px;
      top: 0;
      color: #999;
    }
  }
  > .height-light-add {
    margin-bottom: 16px;
    > .tips {
      margin-left: 10px;
      font-size: 14px;
      color: #999;
      font-weight: normal;
      cursor: pointer;
    }
    > .help {
      text-decoration: none;
      color: #4a49cc;
      font-size: 14px;
    }
  }
  > .height-light-case {
    line-height: 24px;
    background: #f2f3f7;
    border-radius: 4px;
    color: #afafde;
    padding: 10px 20px;
    > p {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
