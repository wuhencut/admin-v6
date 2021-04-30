<template>
  <div class="upload-file">
    <div class="upload-button" v-if="!disabled">
      <span
        ><i class="el-icon-upload2"></i
        >{{ value === "" ? "上传文件" : "重新上传" }}</span
      >
      <input
        type="file"
        @change="upload($event)"
        accept="image/jpg,image/jpeg,image/png,	application/pdf"
      />
    </div>
    <span style="margin-left:10px" v-if="!disabled"
      >支持PDF、PNG、JPG、JPEG格式，PDF不超过50M</span
    >
    <p>
      <a
        :href="value"
        target="_blank"
        v-if="value !== ''"
        style="color:#409EFF;text-decoration: none;"
        ><i class="el-icon-folder-opened"></i>查看Brief</a
      >
      <el-button
        type="text"
        v-if="value !== '' && !disabled"
        style="margin-left:10px"
        @click="delBtnClick"
        >删除</el-button
      >
    </p>
  </div>
</template>
<script>
import axios from "axios";
import getUserInfo from "../api/getUserInfo";
import env from "../api/env";
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },

  data() {
    return {};
  },
  methods: {
    delBtnClick() {
      this.$emit("input", "");
    },
    async upload(event) {
      let file = event.target.files[0];
      if (!file) {
        this.$message.error("请选择文件");
        return false;
      }
      if (file.size > 1024 * 1024 * 50) {
        this.$message.error("上传的文件大于50M，请重新上传");
      }
      let url = `http://${env}.sponsor.test.collectivedynamic.com:30000/v2/sts/oss_token`;
      //线上环境
      if (env == "online") {
        url = "https://qtdl-api.yingtu.co/v2/sts/oss_token";
      }
      let userInfo = getUserInfo();

      let req = {
        source: "web",
        sid: userInfo.sid,
        user_id: userInfo.user_id,
        operator_id: userInfo.user_id,
        operator_type: 0,
        data: {}
      };
      let res = await axios.post(url, req);
      if (res.error_code == 0) {
        //拼接获取文件名
        let fileName =
          new Date().getTime() +
          file.size.toString() +
          "." +
          file.name.split(".").pop();
        let userId = userInfo.user_id;
        let key = userId + "/" + fileName;
        let form = new FormData();
        form.append("OSSAccessKeyId", res.data.accessid);
        form.append("policy", res.data.policy);
        form.append("Signature", res.data.signature);
        form.append("key", key);
        form.append("file", file);
        form.append("success_action_status", 200); //设置返回200 默认204

        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };

        let post =
          "https://" + res.data.bucket + "." + res.data.host.split("//").pop();

        let ossRes = await axios.post(post, form, config);
        if (ossRes.status == 200) {
          let result = "https://" + res.data.cdnUrl + "/" + key;
          this.$emit("input", result);
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败:获取上传token失败");
        }
      } else {
        this.$message.error("上传失败:获取上传token失败");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.upload-button {
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
</style>
