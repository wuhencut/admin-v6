import env from "./env";
//测试环境
let BASEURL = "http://dev.admin.test.collectivedynamic.com:30000";
let PASSPORT = "http://dev.passport.test.collectivedynamic.com:30000";
//线上环境
if (env == "online") {
  BASEURL = "https://admin-api.yingtu.co";
  PASSPORT = "https://passport.ingtube.com";
} else {
  if (env == "dev2") {
    //测试环境
    BASEURL = "http://dev2.admin.test.collectivedynamic.com:30000";
    PASSPORT = "http://dev2.passport.test.collectivedynamic.com:30000";
  }
  if (env == "dev3") {
    //测试环境
    BASEURL = "http://dev3.admin.test.collectivedynamic.com:30000";
    PASSPORT = "http://dev3.passport.test.collectivedynamic.com:30000";
  }
  if (env == "dev4") {
    //测试环境
    BASEURL = "http://dev4.admin.test.collectivedynamic.com:30000";
    PASSPORT = "http://dev4.passport.test.collectivedynamic.com:30000";
  }
  if (env == "master") {
    //测试环境
    BASEURL = "http://master.admin.test.collectivedynamic.com:30000";
    PASSPORT = "http://master.passport.test.collectivedynamic.com:30000";
  }
  document.title = "【测试】映兔管理后台";
}
export { BASEURL, PASSPORT };
