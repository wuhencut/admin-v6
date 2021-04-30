<template>
  <el-dialog
    class="dialog"
    width="375px"
    :visible.sync="showPreview"
    append-to-body
    :before-close="closePreview"
  >
    <div class="caozuo-icons">
      <a
        :key="index"
        v-for="(tab, index) in tabs"
        :class="{ active: currentTab === index }"
        @click="changeTab(index)"
        >{{ tab.label }}</a
      >
      <span class="close-preview" @click="closePreview"
        ><svg
          t="1599722538465"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5169"
          width="30"
          height="30"
        >
          <path
            d="M509.262713 5.474574c281.272162 0 509.262713 228.02238 509.262713 509.262713 0 281.272162-227.990551 509.262713-509.262713 509.262713s-509.262713-227.990551-509.262713-509.262713c0-281.240333 227.990551-509.262713 509.262713-509.262713z m135.050106 278.725849L509.262713 419.250528l-135.050106-135.050105-90.012184 90.012184L419.186871 509.262713l-135.018277 135.081935 90.012184 90.012184L509.262713 599.274897l135.050106 135.050106 90.012184-90.012184L599.274897 509.262713l135.050106-135.050106-90.012184-90.012184z"
            p-id="5170"
            fill="#FBCD04"
          ></path></svg
      ></span>
    </div>
    <div class="container">
      <slot v-if="first" name="first"></slot>
      <slot v-if="second" name="second"></slot>
      <slot v-if="third" name="third"></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["value", "tabs", "showPreview"],
  data() {
    return {
      currentTab: 0, // 当前点击的tab
      first: true, //三个tab
      second: false,
      third: false
    };
  },
  mounted() {},
  methods: {
    closePreview() {
      this.$emit("close");
    },
    changeTab(index) {
      // 切换tab
      this.currentTab = index;
      if (this.tabs[index].name == "first") {
        this.first = true;
        this.second = false;
        this.third = false;
      } else if (this.tabs[index].name == "second") {
        this.second = true;
        this.first = false;
        this.third = false;
      } else {
        this.third = true;
        this.first = false;
        this.second = false;
      }
    }
  }
};
</script>
<style lang="less">
.dialog {
  .el-dialog__header {
    display: none;
  }
}
</style>
<style scoped>
.container {
  position: fixed;
  width: 375px;
  background: #fff;
  height: 600px;
  color: #000;
  top: 100px;
  left: 50%;
  padding-bottom: 60px;
  margin-left: -188px;
  z-index: 101;
  overflow-y: auto;
  font-family: "Microsoft YaHei";
  box-sizing: border-box;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.title-tip {
  color: #9f9da1;
  font-size: 14px;
  margin-top: 10px;
}

.close-preview {
  position: absolute;
  right: -50px;
  top: 0;
  z-index: 102;
  display: inline-block;
  width: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}

.caozuo-icons {
  position: fixed;
  top: 100px;
  left: 50%;
  margin-left: 187px;
  display: inline-block;
  width: 60px;
  z-index: 103;
  background-color: #fff;
}

.caozuo-icons a {
  display: block;
  line-height: 40px;
  text-align: center;
  border: 1px solid #ececec;
  cursor: pointer;
}

.caozuo-icons a:last-child {
  border-top: none;
}

.active {
  color: #fff;
  background: #2f89ff;
}

::-webkit-scrollbar {
  width: 0;
}
</style>
