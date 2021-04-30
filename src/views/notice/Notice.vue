<template>
  <div class="page-notice">
    <div class="notice-list">
      <!-- title -->
      <div class="list-title">
        <div class="list-title-text">商家端Banner列表</div>
        <el-button @click="createBtnClick" type="text" icon="el-icon-plus"
          >新增</el-button
        >
      </div>
      <!-- title -->
      <!-- list -->
      <div class="list">
        <div
          class="item"
          :key="item.id"
          :class="{ 'item-active': item.id == notice.id }"
          v-for="item in list"
          @click="itemClick(item)"
        >
          <h2 class="item-title">{{ item.title }}</h2>
          <p class="item-time">
            {{ moment(item.start_time * 1000).format("YYYY-MM-DD HH:mm") }}
          </p>
        </div>
      </div>
      <!-- list -->
      <!-- pagination -->
      <div class="pagination">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="count"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
      <!-- pagination -->
    </div>
    <div class="notice-editor">
      <el-form
        :disabled="notice.id != undefined"
        :model="notice"
        ref="noticeForm"
        :rules="noticeFormRules"
      >
        <el-form-item>
          <h2 style="font-size:20px;">
            <span v-show="notice.id == undefined">新增推送</span>
            <span v-show="notice.id != undefined">查看推送</span>
          </h2>
        </el-form-item>
        <el-form-item prop="title">
          <div>
            标题 <span>{{ notice.title.length }}/30</span>
          </div>
          <el-input v-model.trim="notice.title" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <div>
            消息内容 <span>{{ notice.content.length }}/300</span>
          </div>
          <el-input
            type="textarea"
            v-model.trim="notice.content"
            :rows="3"
            :maxlength="300"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            活动链接（选填）<a
              v-show="notice.link"
              target="—new"
              :href="notice.link"
              >跳转</a
            >
          </div>
          <el-input v-model="notice.link"></el-input>
        </el-form-item>
        <el-form-item>
          <div>发送时间</div>
          <el-radio-group
            v-model="notice.send_type"
            @change="notice.start_time = ''"
          >
            <el-radio :label="1">即时推送</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="notice.send_type == 2">
          <el-date-picker
            v-model="date.day"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-time-picker
            v-model="date.time"
            :picker-options="timeOptions"
            placeholder="选择时间"
            value-format="HH:mm"
            :clearable="false"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item v-show="!notice.id">
          <el-button type="primary" @click="submitClick"> 确认 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      moment: moment,
      notice: {},
      isNew: true,
      pickerOptions: {},
      timeOptions: {},
      date: {
        day: "",
        time: ""
      },
      noticeTemplt: {
        title: "",
        content: "",
        link: "",
        send_type: 1, //1及时推送 2定时推送
        start_time: 0
      },
      noticeFormRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      search: {
        //查询条件
        page_size: 10,
        page_id: 1
      },
      list: [], //列表
      count: -1 //总条数
    };
  },
  created() {
    this.notice = { ...this.noticeTemplt };
    this.searchNotices();
  },
  watch: {
    "date.day"(val) {
      if (this.isNew == true) {
        let timeStart = moment(new Date().getTime()).format("HH:mm:ss");
        if (
          this.date.day.getTime() >
          new Date(new Date().toLocaleDateString()).getTime() //获取本地时间当天的零点
        ) {
          timeStart = "00:00:00";
        }
        if (val) {
          this.timeOptions = {
            selectableRange: timeStart + "- 23:59:00"
          };
        }
      }
    },
    "notice.send_type"(val) {
      //即时和定时切换的时候
      if (val == 2 && this.isNew == true) {
        //也是只有在添加的时候才监听
        this.date.day = new Date(new Date().toLocaleDateString()); //当下时间
        this.date.time = new Date(
          parseInt(new Date().getTime() / 60000) * 60000
        );
        this.pickerOptions = {
          disabledDate(time) {
            return (
              time.getTime() <
                new Date(new Date().toLocaleDateString()).getTime() ||
              time.getTime() >
                new Date(new Date().toLocaleDateString()).getTime() +
                  30 * 24 * 3600 * 1000 //限制1个月的范围
            );
          }
        };
      }
    }
  },
  methods: {
    //点击新增按钮
    createBtnClick() {
      this.isNew = true;
      this.notice = { ...this.noticeTemplt };
      //清除表单验证
      this.$refs.noticeForm.clearValidate();
    },
    //点击确认按钮
    submitClick() {
      this.$refs.noticeForm.validate(async ok => {
        if (ok) {
          //及时推送
          if (this.notice.send_type == 1) {
            this.notice.start_time = parseInt(new Date().getTime() / 1000);
          } else {
            if (this.date.day) {
              let timeTemp;
              // 选择时间后会变成 hh:ss的格式
              if (typeof this.date.time == "string") {
                let arr = this.date.time.split(":");
                timeTemp = arr[0] * 60 * 60 * 1000 + arr[1] * 60 * 1000;
              } else {
                timeTemp =
                  this.date.time.getHours() * 60 * 60 * 1000 +
                  this.date.time.getMinutes() * 60 * 1000;
              }
              this.notice.start_time =
                (this.date.day.getTime() + timeTemp) / 1000;
            }
          }
          let res = await this.$api.noticeCreate(this.notice);
          if (res.error_code == 0) {
            this.$message.success("创建成功");
            this.notice = { ...this.noticeTemplt };
            this.searchNotices();
          }
        } else {
          return false;
        }
      });
    },
    //获取消息列表
    async searchNotices() {
      let res = await this.$api.noticeList(this.search);
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.count = res.data.count;
      } else {
        this.list = [];
        this.total = 0;
      }
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.searchNotices();
    },
    //点击
    itemClick(item) {
      this.notice = item;
      this.isNew = false;
      this.date.day = moment(item.start_time * 1000).format("YYYY-MM-DD");
      this.date.time = moment(item.start_time * 1000).format("HH:mm");
      this.$refs.noticeForm.clearValidate();
    }
  }
};
</script>
<style lang="less" scoped>
.page-notice {
  min-width: 1000px;
  display: flex;
  background: #fff;
  .notice-list {
    width: 300px;
    border-right: 1px solid #e6e6e6;
    > .list-title {
      padding: 10px;
      display: flex;
      border-bottom: 1px solid #eee;
      > .list-title-text {
        flex: 1;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #000;
      }
    }
    > .list {
      > .item {
        padding: 10px;
        border-left: 4px solid #fff;
        border-bottom: 1px solid #e6e6e6;
        cursor: pointer;
        > .item-title {
          color: #000;
          display: flex;
          .title {
            font-weight: bold;
            flex: 1;
          }
          .fr {
            float: right;
          }
        }
        > .item-time {
          text-align: right;
          color: #999;
        }
      }
      > .item-active {
        border-left: 4px solid #409eff;
      }
    }
    > .pagination {
      padding: 10px 5px;
    }
  }
  > .notice-editor {
    flex: 1;
    padding: 30px;
  }
}
</style>
