<template>
  <div>
    <div class="container" ref="outer">
      <div class="outer" ref="messageBox">
        <div
          class="message"
          v-for="(item, index) in messageList"
          :key="index"
          :class="{ 'flex-end': item.user_type == 0 }"
        >
          <img :src="item.avatar" alt="" />
          <div class="content" :class="{ fr: item.user_type == 0 }">
            <p class="name flex" :class="{ 'flex-end': item.user_type == 0 }">
              <span class="flex-s1"
                >({{
                  item.user_type == 0
                    ? "小二"
                    : item.user_type == 1
                    ? "博主"
                    : "商户"
                }}) {{ item.name }}</span
              >
              <span class="time">{{
                moment(item.create_time * 1000).format("YYYY/MM/DD HH:mm")
              }}</span>
            </p>
            <div class="message-content">
              <p class="txt" v-if="item.text">{{ item.text }}</p>
              <div
                class="img-box"
                v-for="(url, index) in item.images || []"
                :key="index"
              >
                <!-- <a
                  v-if="url.substring(url.lastIndexOf('.') + 1) == 'mp4'"
                  :href="url"
                  target="_blank"
                  style="display:block; margin-bottom: 5px;"
                >
                  查看视频
                </a> -->
                <video
                  v-if="url.substring(url.lastIndexOf('.') + 1) == 'mp4'"
                  width="100"
                  height="100"
                  :key="index"
                  :src="url"
                  controls
                  autoplay
                  style="margin-left:10px"
                ></video>
                <img
                  v-else
                  @click.stop="showImg(url)"
                  class="img"
                  :src="url"
                  alt=""
                />
              </div>
              <div v-if="item.urls && item.urls.length">
                <a
                  class="link"
                  v-for="(url, i) in item.urls"
                  :key="i"
                  target="_new"
                  :href="url"
                  >{{ url }}</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="mod-message">
        <p class="title">发送留言 {{ message.content.text.length }} / 150</p>
        <el-input
          type="textarea"
          v-model="message.content.text"
          :rows="2"
          maxlength="150"
        ></el-input>
        <div class="footer">
          <div class="upload-img">
            <upload-img-list v-model="message.content.images"></upload-img-list>
          </div>
          <div class="btn">
            <el-button @click="closeDg">取消</el-button>
            <el-button
              :disabled="msgDisabled"
              type="primary"
              @click="leftMessage"
              >发送</el-button
            >
          </div>
        </div>
      </div>

      <el-dialog
        title="图片"
        width="500px"
        :visible.sync="showImgDg"
        append-to-body
      >
        <img width="100%" :src="msgImg" alt="" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import UploadImgList from "./UploadImgList";
export default {
  name: "Message",
  components: {
    UploadImgList
  },
  props: {
    id: String,
    msgDisabled: Boolean
  },
  data() {
    return {
      moment: moment,
      showImgDg: false,
      messageList: [], // 协商列表
      msgImg: "",
      message: {
        order_id: "",
        content: {
          text: "",
          images: []
        }
      }
    };
  },
  mounted() {
    this.message.order_id = this.id;
    this.getMessageRecord();
    this.initMsgOuter();
  },
  methods: {
    // 关闭弹窗
    closeDg() {
      this.$emit("closeDg");
    },
    // 展示大图
    showImg(img) {
      this.msgImg = img;
      this.showImgDg = true;
    },
    // 获取沟通列表
    async getMessageRecord() {
      let res = await this.$api.getCommentRecord({
        order_id: this.message.order_id
      });
      if (res.error_code == 0) {
        this.messageList = res.data.list || [];
        this.$nextTick(() => {
          this.initMsgOuter();
        });
      }
    },
    // 提交工单留言
    async leftMessage() {
      if (!this.message.content.images.length && !this.message.content.text) {
        this.$message.error("对空消息过敏，请输入您要发表的留言");
        return false;
      }
      let res = await this.$api.leftMessage(this.message);
      if (res.error_code == 0) {
        this.$message.success("留言成功");
        this.message.content = {
          text: "",
          images: []
        };
        this.getMessageRecord();
      }
    },
    // 展示最新消息
    initMsgOuter() {
      // 自动刷新到最新消息
      if (this.$refs.messageBox.offsetHeight > 400) {
        this.$refs.outer.scrollTop = this.$refs.messageBox.offsetHeight - 400;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.flex-s1 {
  flex: 1;
}
.flex {
  display: flex;
}
.flex-end {
  flex-direction: row-reverse;
}

.container {
  max-height: 400px;
  overflow-y: scroll;
  .message {
    padding-bottom: 10px;
    display: flex;
    .link {
      display: block;
      padding: 5px 0;
    }
    .fr {
      text-align: right;
    }
    .content {
      padding: 0 20px;
      width: 300px;
      .name {
        font-weight: bold;
      }
      .message-content {
        padding: 10px 0;
        .txt {
          text-align: left;
          display: inline-block;
          max-width: 400px;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          background-color: rgba(64, 158, 255, 0.1);
          border: 1px solid rgba(64, 158, 255, 0.2);
          color: #409eff;
        }
        .img {
          margin-right: 10px;
          margin-top: 10px;
        }
        img {
          width: 50px;
          border-radius: 4px;
        }
      }
    }
    > img {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      object-fit: cover;
    }
  }
}
.mod-message {
  .footer {
    display: flex;
    .upload-img {
      flex: 1;
    }
    .btn {
      padding-top: 10px;
      width: 122px;
    }
  }
  .title {
    padding: 10px 0;
    font-weight: bold;
  }
  .upload-img {
    padding: 10px 0;
  }
}
</style>
