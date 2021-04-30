<template>
  <div class="component-editor">
    <div class="editor-top">
      <div class="upload">
        <span>插入图片</span>
        <input
          ref="imgfile"
          type="file"
          accept="image/jpg,image/png,image/jpeg"
          @change="uploadImage"
        />
      </div>
    </div>
    <div
      contenteditable="true"
      class="editor-content"
      ref="editor"
      @click="click"
      @input="input"
      @paste="paste"
      @blur="blur"
      @focus="focus"
    ></div>
  </div>
</template>
<script>
import upload from "../utils/upload";
export default {
  props: {
    value: {
      type: String,
      default: "<p><br></p>"
    }
  },
  data() {
    return {
      range: null,
      isFocus: false
    };
  },
  watch: {
    value() {
      if (!this.isFocus) {
        this.$refs.editor.innerHTML = this.value || "<p><br></p>";
      }
    }
  },
  mounted() {
    this.$refs.editor.innerHTML = this.value || "<p><br></p>";
  },
  methods: {
    //input事件
    input(e) {
      let html = e.target.innerHTML;
      //删除到
      if (html === "") {
        e.target.innerHTML = "<p><br></p>";
        html = "<p><br></p>";
      }
      if (html === "<p><br></p>") {
        this.$emit("input", "");
      } else {
        this.$emit("input", html);
      }
    },
    click(e) {
      if (e.target.nodeName == "IMG") {
        window.getSelection().removeAllRanges();
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNode(e.target);
        selection.addRange(range);
      }
    },
    focus() {
      this.isFocus = true;
    },
    //blur
    blur() {
      this.isFocus = false;
      this.range = window.getSelection().getRangeAt(0);
    },
    //粘贴事件
    paste(e) {
      e.preventDefault();
      e.stopPropagation();
      let clipboardData = e.clipboardData || window.clipboardData;
      let text = clipboardData.getData("text/plain"); //取出剪贴板的文本
      document.execCommand("insertText", false, text); //在光标插入位置插入文本内容或者覆盖所选的文本内容。
      this.$emit("input", this.$refs.editor.innerHTML); //监听input事件，使父组件与自组件显示内容一致
    },
    uploadImage(e) {
      let files = e.target.files; //取得选中的文件(图片等)
      upload(files, res => {
        //回调方法
        this.$refs.imgfile.value = "";
        if (res.code == 200) {
          if (this.range) {
            let newNode = document.createElement("img");
            newNode.setAttribute("src", res.result);
            this.range.deleteContents();
            this.range.insertNode(newNode); //在Range的起始位置插入节点的方法
          } else {
            let node = document.createElement("p");
            node.innerHTML = `<img src="${res.result}">`;
            this.$refs.editor.appendChild(node);
          }
          this.$emit("input", this.$refs.editor.innerHTML);
        }
      });
    }
  }
};
</script>
<style lang="less">
.component-editor {
  border: 1px solid #dcdfe6;
  background: #fff;
  > .editor-top {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #dcdfe6;
    > .upload {
      position: relative;
      width: 60px;
      height: 40px;
      padding: 0 20px;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 14px;
      color: #999;
      overflow: hidden;
      text-align: center;
      line-height: 40px;
      > input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        font-size: 200px;
        opacity: 0;
      }
    }
  }
  > .editor-content {
    height: 500px;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 15px;
    outline: none;
    p {
      margin-bottom: 15px;
    }
    img {
      max-width: 100%;
      vertical-align: top;
    }
  }
}
</style>
