<template>
  <div class="compoment-platform">
    <img :src="iconArray[platform]" :width="size" :height="size" v-if="icon" />
    <span v-if="text">{{ platformTextArray[platform] }}</span>
  </div>
</template>
<script>
import { platform } from "../utils/setting";
export default {
  props: {
    platform: {
      type: [String, Number],
      default: "0"
    },
    icon: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      platformTextArray: platform,
      iconArray: {
        // 0: require("../../assets/icon/icon-yingtu.png"),
        0: require("../assets/icon/icon-yingtu.png"),
        1: require("../assets/icon/icon-weibo.png"),
        2: require("../assets/icon/icon-xiaohongshu.png"),
        3: require("../assets/icon/icon-meipai.png"),
        4: require("../assets/icon/icon-bilibili.png"),
        5: require("../assets/icon/icon-wetaobao.png"),
        6: require("../assets/icon/icon-wechat.png"),
        7: require("../assets/icon/icon-douyin.png"),
        8: require("../assets/icon/icon-kuaishou.png"),
        9: require("../assets/icon/icon-yangtao.png"),
        weibo: require("../assets/icon/icon-weibo.png"),
        xiaohongshu: require("../assets/icon/icon-xiaohongshu.png"),
        meipai: require("../assets/icon/icon-meipai.png"),
        bilibili: require("../assets/icon/icon-bilibili.png"),
        wetaobao: require("../assets/icon/icon-wetaobao.png"),
        wechat: require("../assets/icon/icon-wechat.png"),
        douyin: require("../assets/icon/icon-douyin.png"),
        kuaishou: require("../assets/icon/icon-kuaishou.png"),
        yangtao: require("../assets/icon/icon-yangtao.png")
      }
    };
  }
};
</script>
<style lang="less" scoped>
.compoment-platform {
  display: inline;
  line-height: 0;
  > img {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  > span {
    margin-left: 5px;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
