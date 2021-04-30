<template>
  <div class="page-theme">
    <el-form>
      <el-form-item>
        <p>主题活动生成工具</p>
      </el-form-item>
    </el-form>
    <el-form label-position="left" label-width="100px">
      <el-form-item label="活动头图">
        <upload-img
          :width="320"
          :height="120"
          v-model="form.banner"
        ></upload-img>
      </el-form-item>
      <el-form-item label="活动介绍链接">
        <el-input style="width:320px;" v-model="form.link"></el-input>
      </el-form-item>
      <el-form-item label="活动列表">
        <div class="item-wrap" v-for="(item, index) in form.list" :key="index">
          <div class="item">
            <div class="item-img">
              <img :src="item.img" width="100" height="100" alt="商品图" />
            </div>
            <div class="item-info">
              <h2 class="item-title">{{ item.title }}</h2>
              <p class="item-sub">{{ item.subtitle }}</p>
              <p class="item-number">数量 {{ item.number }}</p>
            </div>
          </div>
          <el-button type="text" @click="delBtnClick(index)">删除</el-button>
          <el-button
            type="text"
            @click="moveBtnClick(index, index + 1)"
            :disabled="index == form.list.length - 1"
            >下移</el-button
          >
          <el-button
            type="text"
            @click="moveBtnClick(index, index - 1)"
            :disabled="index == 0"
            >上移</el-button
          >
        </div>
        <div class="item-add" @click="addBtnClick">
          <i class="el-icon-plus"></i>添加活动
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="dialog = true" type="primary">生成数据</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="生成数据" :visible.sync="dialog" width="800px">
      <p>复制下面的文本给前端人员</p>
      <div class="box">{{ JSON.stringify(form) }}</div>
    </el-dialog>
    <el-dialog title="选择活动" :visible.sync="select.dialog" width="800px">
      <el-table :data="select.list">
        <el-table-column label="选择" width="80">
          <template slot-scope="scope">
            <el-checkbox
              :checked="isSelect(scope.row)"
              @change="change(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="活动头图" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.img" width="50" height="50" alt="商品头图" />
          </template>
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <p>{{ scope.row.title }}</p>
            <p>{{ scope.row.subtitle }}</p>
          </template>
        </el-table-column>
        <el-table-column label="活动库存" width="150">
          <template slot-scope="scope">
            <p>{{ scope.row.number }}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import UploadImg from "../../components/UploadImg";
export default {
  components: {
    UploadImg
  },
  data() {
    return {
      form: {
        banner: "",
        link: "",
        list: []
      },
      dialog: false,
      select: {
        dialog: false,
        list: []
      }
    };
  },
  methods: {
    //是否选中
    isSelect(row) {
      let result = false;
      for (let i = 0; i < this.form.list.length; i++) {
        if (this.form.list[i].campaignId == row.campaignId) {
          result = true;
        }
      }
      return result;
    },
    //checkbox
    change(row) {
      let result = false;
      for (let i = 0; i < this.form.list.length; i++) {
        if (this.form.list[i].campaignId == row.campaignId) {
          this.form.list.splice(i, 1);
          result = true;
        }
      }
      if (!result) {
        this.form.list.push(row);
      }
    },
    //点击添加按钮
    addBtnClick() {
      this.select.list = [];
      setTimeout(() => {
        this.select.list = [
          {
            img:
              "http://video.yingtu.co/6/1530176689630409448.jpg?x-oss-process=image/resize,w_500",
            title: "泰国Bath&Bloom 茉莉花清爽沐浴露",
            productId: "1011452956563742720",
            campaignId: "2821",
            subtitle: "Home SPA必备",
            number: 10
          },
          {
            img:
              "http://video.yingtu.co/6/1530177310671331268.jpg?x-oss-process=image/resize,w_500",
            title: "泰国Bath&Bloom 茉莉清爽身体乳",
            productId: "991986998145196032",
            campaignId: "2822",
            subtitle: "忍不住想分享的味道",
            number: 10
          },
          {
            img:
              "http://video.yingtu.co/6/1530178310140407882.jpg?x-oss-process=image/resize,w_500",
            title: "FERRAGAMO/菲拉格慕 梦中情人淡香氛",
            productId: "1012216476083425280",
            campaignId: "2864",
            subtitle: "是小仙女的味道",
            number: 40
          }
        ];
        this.select.dialog = true;
      }, 1);
    },
    //删除
    delBtnClick(index) {
      this.form.list.splice(index, 1);
    },
    moveBtnClick(firstIndex, lastIndex) {
      var firstItem = this.form.list[firstIndex];
      var lastItem = this.form.list[lastIndex];
      this.form.list.splice(firstIndex, 1, lastItem);
      this.form.list.splice(lastIndex, 1, firstItem);
    }
  }
};
</script>

<style lang="less" scoped>
.page-theme {
  .item-wrap {
    display: flex;
  }
  .item {
    width: 320px;
    height: 120px;
    padding: 9px 10px;
    border: 1px solid #dcdfe6;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    margin-bottom: 10px;
    > .item-img {
      width: 100px;
      height: 100px;
      img {
        vertical-align: top;
      }
    }
    > .item-info {
      padding: 0 20px;
      > .item-title {
        font-size: 14px;
        height: 40px;
        line-height: 20px;
        overflow: hidden;
      }
      > .item-sub {
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
        color: #999;
      }
      > .item-number {
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
        color: #999;
      }
    }
  }
  .item-add {
    width: 320px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .box {
    border: 1px solid #dcdfe6;
    padding: 20px;
  }
}
</style>
