import env from "../api/env";
const platformList = [
  {
    id: "1",
    name: "微博"
  },
  {
    id: "2",
    name: "小红书"
  },
  {
    id: "3",
    name: "美拍"
  },
  {
    id: "4",
    name: "B站"
  },
  {
    id: "5",
    name: "微淘"
  },
  {
    id: "6",
    name: "微信公众号"
  },
  {
    id: "7",
    name: "抖音"
  },
  {
    id: "8",
    name: "快手"
  },
  {
    id: "9",
    name: "逛逛"
  }
];

// 不同渠道对应的枚举值
const platformEnum = {
  WEIBO: "1",
  XIAOHONGSHU: "2",
  MEIPAI: "3",
  BZHAN: "4",
  WEITAO: "5",
  WEIXIN_PUBLIC_ACCOUNT: "6",
  DOUYIN: "7",
  KUAISHOU: "8",
  GUANGGUANG: "9"
};
  
export function goPlatformUrl(url) {
  if (env == "online") {
    window.open("http://www.ingtube.com/qrcode/index.html?url=" + url);
  } else {
    window.open("http://test.ingtube.com/qrcode/index.html?url=" + url);
  }
}
export function getPlatformName(platfromId) {
  if (platfromId !== "0") {
    return platformList.find(item => {
      return item.id == platfromId;
    }).name;
  }
}

export default {
  platformEnum,
  platformList,
  getPlatformName,
  goPlatformUrl
};
