<template>
  <div class="upload-img-list">
    <div
      class="img-wrap"
      :style="{ width: widthStyle, height: heightStyle }"
      v-for="(item, index) in imgList"
      :key="index"
    >
      <img
        class="img"
        width="100%"
        height="100%"
        :src="item"
        @click="itemClick(item)"
      />
      <span v-if="!disabled" class="close" @click="closeBtnClick(index)"
        ><i class="el-icon-circle-close"></i
      ></span>
    </div>
    <div v-if="!disabled" class="add-wrap" v-show="value.length < this.length">
      <span><i class="el-icon-plus"></i>上传图片</span>
      <input
        ref="inp"
        class="file-input"
        type="file"
        @change="upload($event)"
        accept="image/jpg,image/jpeg, image/png"
      />
    </div>
    <el-dialog
      :visible.sync="showImg.show"
      :append-to-body="true"
      :show-close="false"
      width="440px"
    >
      <img width="400px" :src="showImg.src" />
    </el-dialog>
  </div>
</template>
<script>
import upload from "../utils/upload";
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 100
    },
    length: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      showImg: {
        show: false,
        src: ""
      }
    };
  },
  mounted() {},
  computed: {
    imgList() {
      if (!this.value) {
        return [];
      } else {
        return this.value;
      }
    },
    widthStyle() {
      if (typeof this.width == "string") {
        return this.width;
      } else {
        return this.width + "px";
      }
    },
    heightStyle() {
      if (typeof this.height == "string") {
        return this.height;
      } else {
        return this.height + "px";
      }
    }
  },
  methods: {
    itemClick(item) {
      this.showImg.src = item;
      this.showImg.show = true;
    },
    closeBtnClick(index) {
      this.value.splice(index, 1);
      // input的value没有 被清除，导致传同一张图片，同一个值，不会出发onChange事件
      this.$refs.inp.value = null;
    },
    upload(event) {
      let files = event.target.files;
      upload(files, res => {
        if (res.code == 200) {
          this.value.push(res.result);
          this.$message.success("上传成功");
          this.$refs.inp.value = null;
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.upload-img-list {
  display: inline-block;
  > .img-wrap {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    border: 1px solid #e6e6e6;
    // border-radius:4px;
    margin-right: 10px;
    > .img {
      // border-radius:4px;
      object-fit: cover;
      cursor: pointer;
    }
    > .close {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 20px;
      color: #f56c6c;
      cursor: pointer;
      display: block;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
    }
  }
  > .add-wrap {
    display: inline-block;
    vertical-align: top;
    position: relative;
    cursor: pointer;
    padding: 0 12px;
    line-height: 32px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    // border-radius:4px;
    font-size: 12px;
    > .file-input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      font-size: 100px;
      opacity: 0;
    }
  }
}
</style>
