<template>
  <div class="page-web-editor">
    <!-- content -->
    <div class="content">
      <div class="content-left">
        <div class="list-title">
          <div class="list-title-text">
            <span v-show="search.type == 2">活动海报列表</span>
          </div>
          <el-button @click="createBtnClick" type="text" icon="el-icon-plus"
            >新增</el-button
          >
        </div>
        <div class="list">
          <div
            class="item"
            :class="{ 'item-active': item.id == article.id }"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="item-text" @click="itemClick(item)">
              {{ item.title }}
            </div>
            <div class="item-button">
              <el-button @click="delBtnClick(item)" type="text">删除</el-button>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-pagination
            v-if="count > 10"
            :pager-count="5"
            layout="prev, pager, next"
            :total="count"
            @current-change="currentChange"
          ></el-pagination>
        </div>
      </div>
      <div class="content-right">
        <div class="content-editor" v-if="show">
          <div class="editor-type">
            <span v-if="article.id == ''">新增</span>
            <span v-else>编辑</span>
          </div>
          <div class="editor-url" v-show="article.id != ''">
            {{ baseUrl + "?id=" + article.id }}
          </div>
          <div class="editor-title">
            <el-input v-model="article.title" placeholder="页面标题"></el-input>
          </div>
          <div
            class="editor-item"
            v-for="(item, index) in article.content"
            :key="index"
          >
            <div class="editor-item-img">
              <upload-img
                :width="200"
                :height="100"
                v-model="item.img"
              ></upload-img>
            </div>
            <div class="editor-item-link">
              <el-input v-model="item.link" placeholder="对应链接"></el-input>
              <el-button
                @click="removeBtnClick(index)"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
              <el-button
                @click="moveBtnClick(index, index + 1)"
                type="primary"
                icon="el-icon-sort-down"
                :disabled="index == article.content.length - 1"
                >下移</el-button
              >
              <el-button
                @click="moveBtnClick(index, index - 1)"
                type="primary"
                icon="el-icon-sort-up"
                :disabled="index == 0"
                >上移</el-button
              >
            </div>
          </div>
          <div class="editor-footer">
            <el-button icon="el-icon-plus" @click="addItiemBtnClick"
              >添加项</el-button
            >
            <el-button
              icon="el-icon-view"
              type="primary"
              @click="preview = true"
              >预览</el-button
            >
            <el-button icon="el-icon-check" type="primary" @click="saveBtnClick"
              >保存</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- content -->
    <el-dialog title="H5页面预览" :visible.sync="preview" width="375px">
      <div class="preview">
        <div item v-for="(item, index) in article.content" :key="index">
          <a target="_blank" :href="item.link" v-if="item.img">
            <img :src="item.img" alt="图片" />
          </a>
        </div>
      </div>
    </el-dialog>
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
      search: {
        type: 2, //1精选团队 2活动海报
        page_id: 1,
        page_size: 10
      },
      count: 0,
      list: [],
      show: false,
      article: {},
      preview: false
    };
  },
  computed: {
    baseUrl() {
      let url = "http://test.ingtube.com/campaignBanner/index.html";
      if (env == "online") {
        url = "http://www.ingtube.com/campaignBanner/index.html";
      }
      return url;
    }
  },
  watch: {
    "search.type"() {
      this.show = false;
      this.list = [];
      this.count = 0;
      this.search.page_id = 1;
      this.webEditorList();
    }
  },
  created() {
    this.webEditorList();
  },
  methods: {
    //获取列表
    webEditorList() {
      (async () => {
        let res = await this.$api.webEditorList(this.search);
        if (res.error_code == 0) {
          this.list = res.data.list;
          this.count = res.data.count;
        } else {
          this.$message.error("获取信息失败");
        }
      })();
    },
    //currentChange
    currentChange(val) {
      this.search.page_id = val;
      this.webEditorList();
    },
    //点击创建按钮 createBtnClick
    createBtnClick() {
      this.show = true;
      this.article = {
        id: "",
        title: "",
        content: [
          {
            img: "",
            link: ""
          }
        ]
      };
    },
    //点击保存页面
    saveBtnClick() {
      if (this.article.id !== "") {
        //修改
        (async () => {
          let req = {
            id: this.article.id,
            title: this.article.title,
            type: this.search.type,
            content: JSON.stringify(this.article.content)
          };
          let res = await this.$api.webEditorUpdate(req);
          if (res.error_code == 0) {
            this.$message.success("保存成功");
            this.webEditorList();
          } else {
            this.$message.error("保存失败");
          }
        })();
      } else {
        //创建
        (async () => {
          let req = {
            title: this.article.title,
            type: this.search.type,
            content: JSON.stringify(this.article.content)
          };
          let res = await this.$api.webEditorCreate(req);
          if (res.error_code == 0) {
            this.$message.success("创建成功");
            this.article = {
              id: "",
              title: "",
              content: [
                {
                  img: "",
                  link: ""
                }
              ]
            };
            this.search.page_id = 1;
            this.webEditorList();
          } else {
            this.$message.error("创建失败");
          }
        })();
      }
    },
    //点击item
    itemClick(item) {
      this.show = true;
      this.article = {
        id: item.id,
        title: item.title,
        content: JSON.parse(item.content)
      };
    },
    //删除文章
    delBtnClick(item) {
      this.$confirm("确认删除该H5页面吗？", "温馨提示")
        .then(() => {
          (async () => {
            let req = {
              id: item.id
            };
            let res = await this.$api.webEditorDelete(req);
            if (res.error_code == 0) {
              this.show = false;
              this.search.page_id = 1;
              this.webEditorList();
              this.$message.success("删除成功");
            } else {
              this.$message.error("删除失败");
            }
          })();
        })
        .catch(() => {
          return false;
        });
    },
    //添加项
    addItiemBtnClick() {
      let item = {
        img: "",
        link: ""
      };
      this.article.content.push(item);
    },
    //删除项
    removeBtnClick(index) {
      this.article.content.splice(index, 1);
    },
    //移动项
    moveBtnClick(index1, index2) {
      let item1 = this.article.content.slice(index1, index1 + 1)[0];
      let item2 = this.article.content.slice(index2, index2 + 1)[0];
      this.article.content.splice(index1, 1, item2);
      this.article.content.splice(index2, 1, item1);
    }
  }
};
</script>

<style lang="less" scoped>
.page-web-editor {
  min-width: 1000px;
  .preview {
    min-height: 400px;
    img {
      vertical-align: top;
      width: 100%;
    }
  }
  > .tab-bar {
    height: 50px;
    background: #fff;
    > .tab {
      position: relative;
      float: left;
      width: 80px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      > input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
    > .tab-active {
      color: #409eff;
    }
  }
  > .content {
    margin-top: 20px;
    background: #fff;
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
          > .item-text {
            flex: 1;
            padding: 10px;
            font-size: 12px;
            cursor: pointer;
            &:hover {
              color: #409eff;
            }
          }
          > .item-button {
            padding: 10px;
          }
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
        > .editor-type {
          margin-bottom: 30px;
        }
        > .editor-url {
          margin-bottom: 30px;
        }
        > .editor-item {
          display: flex;
          margin-top: 30px;
          > .editor-item-img {
            width: 320px;
            height: 100px;
          }
          > .editor-item-link {
            padding-left: 40px;
            flex: 1;
            line-height: 50px;
          }
        }
        > .editor-footer {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #eee;
        }
      }
    }
  }
}
</style>
