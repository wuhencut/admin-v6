import axios from "axios";
import getUserInfo from "../api/getUserInfo";
import env from "../api/env";

let uploadImg = async (files, callback) => {
  let file = files && files[0];
  if (!file) {
    callback({ code: 101, message: "未选择文件" });
    return false;
  }
  if (file.size > 1024 * 1024) {
    callback({ code: 101, message: "图片文件超过1M,请裁剪后上传" });
    return false;
  }
  // let url = "http://dev.collectivedynamic.com:30010/v2/sts/oss_token"; //'https://admin-api.yingtu.co/v1/admin/user/oss/token';
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
      callback({ code: 200, result: result });
    } else {
      callback({ code: 101, message: "获取ossToken失败" });
    }
  } else {
    callback({ code: 101, message: "获取ossToken失败" });
    return false;
  }
};

export default uploadImg;
