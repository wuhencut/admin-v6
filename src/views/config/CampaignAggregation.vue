<template>
  <div class="campaign">
    <div class="content">
      <div class="content-left">
        <div class="list-title">
          <div class="list-title-text">
            <span>活动内容配置列表</span>
          </div>
          <el-button type="text" icon="el-icon-plus" @click="createBtnClick"
            >新增</el-button
          >
        </div>
        <el-table
          :data="list"
          style="width: 100%"
          :show-header="false"
          @row-click="itemClick"
          highlight-current-row
          class="table"
        >
          <el-table-column type="index" style="width:20px"></el-table-column>
          <el-table-column prop="name" label="活动名称" style="width:80px">
          </el-table-column>
        </el-table>
        <div v-if="count > 0" class="pagination">
          <el-pagination
            small
            layout="prev, pager, next"
            @current-change="currentChange"
            :current-page="this.page_id"
            :page-size="10"
            :total="count"
          >
          </el-pagination>
        </div>
      </div>
      <div class="content-right">
        <div class="content-editor" v-if="show">
          <div class="editor-type">
            <span
              v-if="article.id == ''"
              style="display:inline-block; font-size:16px"
              >新增</span
            >
            <span v-else style="display:inline-block; font-size:16px"
              >编辑</span
            >
          </div>
          <el-form
            :model="article"
            ref="ruleForm"
            label-width="90px"
            style="margin-top:10px"
          >
            <el-form-item label="内容链接：" v-if="article.id !== ''">
              <p>{{ this.baseurl }}?id={{ article.id }}</p>
            </el-form-item>
            <el-form-item label="活动编号：" v-if="article.id !== ''">
              <p>{{ article.id }}</p>
            </el-form-item>
            <el-form-item label="活动专题：" prop="name">
              <el-input
                v-model="article.name"
                placeholder="请输入活动专区标题"
                style="width:500px"
              ></el-input>
            </el-form-item>
            <el-form-item label="页面主图：" prop="primary_image">
              <upload-img
                :width="200"
                :height="100"
                v-model="article.primary_image"
              ></upload-img>
            </el-form-item>
            <el-form-item label="专题tab：" v-if="article.id == ''">
              <el-radio-group
                v-model="article.tab_status"
                @change="selectedChange(article.tab_status)"
              >
                <el-radio :label="1">禁用</el-radio>
                <el-radio :label="2">开启</el-radio>
              </el-radio-group>
              <el-button
                icon="el-icon-plus"
                style="margin-left:30px"
                @click="addItemBtnClick"
                :disabled="add"
                v-if="article.tab_status == 2"
                >添加项</el-button
              >
            </el-form-item>
            <el-form-item label="专题tab：" v-else>
              <p v-if="article.tab_status == 1">禁用</p>
              <p v-else>已开启</p>
            </el-form-item>
            <div v-show="article.tab_status == 2">
              <el-form-item>
                <p>开启专场Tab限制2~4个Tab</p>
              </el-form-item>
              <div
                class="editor-item"
                :key="index"
                v-for="(item, index) in article.topic_tab"
                style="padding-left:70px;margin-top:20px"
              >
                <div class="editor-list">
                  <span>Tab{{ index + 1 }}：</span>
                  <el-input
                    style="width:300px"
                    v-model="item.name"
                    placeholder="请输入"
                    :disabled="editor"
                  ></el-input>
                  <el-button
                    type="primary"
                    icon="el-icon-sort-down"
                    style="margin-left:10px"
                    @click="moveBtnClick(index, index + 1)"
                    :disabled="index == article.topic_tab.length - 1"
                    >下移</el-button
                  >
                  <el-button
                    type="primary"
                    icon="el-icon-sort-up"
                    @click="moveBtnClick(index, index - 1)"
                    :disabled="index == 0"
                    >上移</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteItem(index)"
                    v-if="article.id == ''"
                  ></el-button>
                </div>
                <div
                  class="editor-item-img"
                  style="margin-top:20px; display:flex"
                >
                  <div><span>样式图：</span></div>
                  <div style="display:flex;flex-direction:column;">
                    <span>未选</span>
                    <upload-img
                      :width="200"
                      :height="100"
                      v-model="item.unselected"
                      style="margin-top:10px"
                    ></upload-img>
                  </div>
                  <div
                    style="display:flex;flex-direction:column;margin-left:30px"
                  >
                    <span>选中</span>
                    <upload-img
                      :width="200"
                      :height="100"
                      v-model="item.selected"
                      style="margin-top:10px"
                    ></upload-img>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
          <el-button icon="el-icon-check" type="primary" @click="saveBtnClick"
            >保存</el-button
          >
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import UploadImg from "../../components/UploadImg";
import env from "../../api/env";
export default {
  components: {
    UploadImg
  },
  data() {
    return {
      list: [],
      add: false, //是否可继续添加
      editor: false,
      show: false,
      baseurl: "",
      count: 0,
      article: {},
      articleTemplt: {
        // id: "",
        name: "",
        primary_image: "",
        tab_status: 2,
        topic_tab: [
          {
            name: "",
            unselected: "",
            selected: ""
          },
          {
            name: "",
            unselected: "",
            selected: ""
          }
        ]
      },
      page_id: 1,
      page_size: 10
    };
  },
  // created() {

  // },
  mounted() {
    this.article = { ...this.articleTemplt };
    this.listCate();
    this.createBtnClick();
    this.getUrl();
  },
  methods: {
    getUrl() {
      if (env == "online") {
        this.baseurl = "http://www.ingtube.com/activity/aggregation.html";
      } else {
        this.baseurl = "http://test.ingtube.com/activity/aggregation.html";
      }
    },
    async listCate() {
      let req = {
        page_id: this.page_id,
        page_size: this.page_size
      };
      let res = await this.$api.getCampaignList(req);
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
      }
    },
    selectedChange(i) {
      //点击禁用的时候清空数组
      if (i == 1) {
        this.article.topic_tab.length = 0;
      } else {
        this.article.topic_tab = [
          {
            name: "",
            unselected: "",
            selected: ""
          },
          {
            name: "",
            unselected: "",
            selected: ""
          }
        ];
      }
    },
    createBtnClick() {
      this.editor = false;
      this.show = true;
      this.article = {
        id: "",
        name: "",
        primary_image: "",
        tab_status: 2,
        topic_tab: [
          {
            name: "",
            unselected: "",
            selected: ""
          },
          {
            name: "",
            unselected: "",
            selected: ""
          }
        ]
      };
    },
    addItemBtnClick() {
      let item = {
        name: "",
        unselected: "",
        selected: ""
      };
      this.article.topic_tab.push(item);
      if (this.article.topic_tab.length > 3) {
        this.add = true;
      }
    },
    itemClick(row) {
      this.editor = true;
      this.show = true;
      this.article = {
        id: row.id,
        name: row.name,
        primary_image: row.primary_image,
        tab_status: row.tab_status,
        topic_tab: row.topic_tab
      };
    },
    //删除
    deleteItem(index) {
      this.article.topic_tab.splice(index, 1);
      if (this.article.topic_tab.length < 4) {
        this.add = false;
      }
    },
    //移动项
    moveBtnClick(index1, index2) {
      let item1 = this.article.topic_tab.slice(index1, index1 + 1)[0];
      let item2 = this.article.topic_tab.slice(index2, index2 + 1)[0];
      this.article.topic_tab.splice(index1, 1, item2);
      this.article.topic_tab.splice(index2, 1, item1);
    },
    //切换页码
    currentChange(val) {
      this.page_id = val;
      this.listCate();
    },
    //保存
    saveBtnClick() {
      if (this.article.name == "") {
        this.$message.error("请输入活动专题名称");
        return false;
      }
      if (this.article.primary_image == "") {
        this.$message.error("请上传页面主图");
        return false;
      }
      if (this.article.id == "" && this.article.tab_status == 2) {
        (async () => {
          if (
            this.article.tab_status == 2 &&
            this.article.topic_tab.length < 2
          ) {
            this.$message.error("请至少开启两个Tab！");
            return false;
          }
          for (let i = 0; i < this.article.topic_tab.length; i++) {
            if (this.article.topic_tab[i].name == "") {
              this.$message.error("请输入Tab" + (i + 1) + "的名称");
              return false;
            }
            if (
              this.article.topic_tab[i].unselected == "" ||
              this.article.topic_tab[i].selected == ""
            ) {
              this.$message.error("请上传Tab" + (i + 1) + "的样式图");
              return false;
            }
          }
          let req = {
            name: this.article.name,
            primary_image: this.article.primary_image,
            tab_status: this.article.tab_status,
            topic_tab: this.article.topic_tab
          };
          let res = await this.$api.aggregationEventCreate(req);
          if (res.error_code == 0) {
            this.$message.success("创建成功！");
            this.article = { ...this.articleTemplt };
            this.listCate();
          }
        })();
      } else if (this.article.id == "" && this.article.tab_status == 1) {
        (async () => {
          let req = {
            name: this.article.name,
            primary_image: this.article.primary_image,
            tab_status: this.article.tab_status,
            topic_tab: this.article.topic_tab
          };
          let res = await this.$api.aggregationEventCreate(req);
          if (res.error_code == 0) {
            this.$message.success("创建成功！");
            this.article = { ...this.articleTemplt };
            this.listCate();
          }
        })();
      } else {
        (async () => {
          let req = { ...this.article };
          let res = await this.$api.aggregationEventModify(req);
          if (res.error_code == 0) {
            this.$message.success("修改成功！");
            this.listCate();
          }
        })();
      }
    }
  }
};
</script>
<style lang="less">
.el-table__body tr.current-row > td {
  color: #409eff;
}
.table thead tr th.is-leaf {
  border: 1px solid #ebeef5;
  border-bottom: none;
}
</style>
<style lang="less" scoped>
.campaign {
  min-width: 1000px;
  > .content {
    margin-top: 20px;
    background: #ffffff;
    display: flex;
    > .content-left {
      width: 300px;
      border-right: 1px solid #eee;
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
          display: flex;
          border-left: 4px solid #fff;
          border-bottom: 1px solid #eee;
        }
        > .item-active {
          border-left: 4px solid #409eff;
        }
      }
    }
    > .content-right {
      flex: 1;
      > .content-editor {
        padding: 30px;
        > .content-type {
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>
