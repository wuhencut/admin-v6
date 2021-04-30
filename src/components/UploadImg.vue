<template>
  <div class="in-upload">
    <img
      class="in-upload-img"
      :width="widthStyle"
      :height="heightStyle"
      :src="value"
      v-if="value"
      @click="itemClick"
    />
    <div class="in-upload-button" v-if="!disabled">
      <span
        ><i class="el-icon-plus"></i
        >{{ value === "" ? "上传图片" : "重新上传" }}</span
      >
      <input
        type="file"
        @change="upload($event)"
        accept="image/jpg,image/jpeg,image/png,image/gif"
      />
    </div>
    <el-dialog
      style="text-align: center;"
      :visible.sync="showImg.show"
      :append-to-body="true"
      :show-close="false"
    >
      <img width="100%" :src="showImg.src" />
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
      type: String,
      default: ""
    },
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 100
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
  computed: {
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
    itemClick() {
      this.showImg.src = this.value;
      this.showImg.show = true;
    },
    upload(event) {
      let files = event.target.files;
      upload(files, res => {
        if (res.code == 200) {
          this.$emit("input", res.result);
          this.$message.success("上传成功");
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.in-upload {
  display: inline-block;
  > .in-upload-img {
    object-fit: cover;
    margin-right: 10px;
    border: 1px solid #e6e6e6;
    // border-radius:4px;
  }
  > .in-upload-button {
    overflow: hidden;
    position: relative;
    vertical-align: top;
    display: inline-block;
    padding: 0 12px;
    height: 32px;
    line-height: 32px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    // border-radius:4px;
    font-size: 12px;
    > input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      // font-size: 200px;
      opacity: 0;
    }
  }
}
</style>
