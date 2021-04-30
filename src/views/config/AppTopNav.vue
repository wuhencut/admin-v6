<template>
  <div class="page">
    <div class="header">
      <div class="left">
        <p class="title">顶部导航</p>
        <el-radio-group v-model="search.type" @change="queryList">
          <el-radio :label="1">星选</el-radio>
          <el-radio :label="2">私享</el-radio>
        </el-radio-group>
      </div>
      <div class="right">
        <template v-if="!isEdit">
          <el-button type="primary" @click="isEdit = true">编辑</el-button>
          <el-button class="el-icon-plus" @click="edit(null)">添加</el-button>
        </template>
        <template v-else>
          <el-button @click="cancelEdit">取消</el-button>
          <el-button @click="saveList" type="primary">保存</el-button>
        </template>
      </div>
    </div>

    <draggable class="drag" v-model="list" animation="500" handle=".icon">
      <div class="item" v-for="(item, index) in list" :key="item.id">
        <div class="left">
          {{ item.name }}
        </div>
        <div class="right">
          <template v-if="!isEdit">
            <el-button type="text" @click="edit(item, index)">编辑</el-button>
            <el-button
              type="text"
              @click="checkLink(item.url)"
              v-if="item.style == 3"
              >查看网页</el-button
            >
          </template>
          <template v-else>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="removeClick(item.id)"
            ></el-button>
            <svg
              v-if="isEdit"
              t="1599191034057"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1864"
              width="20"
              height="20"
            >
              <path
                d="M96 256l768 0C881.664 256 896 241.664 896 224S881.664 192 864 192l-768 0C78.336 192 64 206.336 64 224S78.336 256 96 256zM864 512l-768 0C78.336 512 64 526.336 64 544S78.336 576 96 576l768 0C881.664 576 896 561.664 896 544S881.664 512 864 512zM864 832l-768 0C78.336 832 64 846.336 64 864S78.336 896 96 896l768 0c17.664 0 32-14.336 32-32S881.664 832 864 832z"
                p-id="1865"
                fill="#8a8a8a"
              ></path>
            </svg>
          </template>
        </div>
      </div>
    </draggable>

    <el-dialog :title="editTxt + '导航'" :visible.sync="editDg">
      <el-form
        :model="currNav"
        :rules="rules"
        label-position="left"
        label-width="100px"
        ref="form"
      >
        <el-form-item label="导航类型: ">
          <el-radio-group
            :disabled="editTxt == '编辑'"
            v-model="currNav.style"
            @change="radioChange"
          >
            <el-radio :label="3">网页</el-radio>
            <el-radio :label="2">前台类目</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="currNav.style >= 3">
          <el-form-item v-if="currNav.style == 3" label="内容网址: " prop="url">
            <el-input v-model="currNav.url"></el-input>
          </el-form-item>
          <el-form-item label="导航标题" prop="name">
            <el-input v-model="currNav.name"></el-input>
          </el-form-item>
          <el-form-item label="特殊图片">
            <div class="wrapper">
              <div class="item">
                <el-form-item prop="unselected_image">
                  <p class="tip">未选</p>
                  <upload-img v-model="currNav.unselected_image"></upload-img>
                </el-form-item>
              </div>
              <div class="item">
                <el-form-item prop="selected_image">
                  <p class="tip">选中</p>
                  <upload-img v-model="currNav.selected_image"></upload-img>
                </el-form-item>
              </div>
            </div>
            <p class="tip">
              <el-button type="primary" @click="clearLoadImgs">不传</el-button>
              为默认字体
            </p>
          </el-form-item>
        </div>
        <div v-if="currNav.style == 2">
          <el-form-item label="选择类目: " prop="category_path">
            <el-cascader
              :show-all-levels="false"
              v-model="currNav.category_path"
              :props="defaultParams"
              ref="cascader"
              v-if="editDg"
              @change="handleChange"
              @click.native="click"
              :popper-class="'cascader' + id"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="导航标题">
            <el-input
              v-model="currNav.name"
              disabled
              style="width: 195px"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="editDg = false">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import UploadImg from "../../components/UploadImg";
export default {
  components: {
    draggable: draggable,
    UploadImg: UploadImg
  },
  data() {
    return {
      id: 1,
      editTxt: "添加",
      // isShow: true,
      isEdit: false,
      search: {
        type: 1 // 1:星选 2 私享
      },
      front: false, //编辑时用来禁用前台类目选项
      list: [],
      currNav: {}, // 当前编辑的导航
      editDg: false,
      currIndex: 0, // 当前编辑点击的导航位置 。为了在编辑的时候不影响 列表的数据展示
      value: [],
      count: 1,
      defaultParams: {
        checkStrictly: true,
        lazy: true,
        lazyLoad: this.lazyLoad,
        leaf: "leaf",
        value: "id",
        label: "name"
      }
    };
  },
  computed: {
    rules() {
      let isNeedImg =
        this.currNav.unselected_image || this.currNav.selected_image;
      return {
        url: [
          {
            required: isNeedImg || this.currNav.style == 3,
            message: "添加导航链接",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请填写导航名",
            trigger: "blur"
          }
        ],
        unselected_image: [
          {
            required: isNeedImg,
            message: "请选择图片",
            trigger: "change"
          }
        ],
        selected_image: [
          {
            required: isNeedImg,
            message: "请选择图片",
            trigger: "change"
          }
        ],
        category_path: [
          {
            required: this.currNav.style == 2,
            message: "请选择类目",
            trigger: "change"
          }
        ]
      };
    }
  },
  created() {
    this.queryList();
  },
  methods: {
    handleChange() {
      if (this.currNav.style == 2) {
        let t = this.$refs["cascader"].getCheckedNodes()[0].pathLabels;
        this.currNav.name = t[t.length - 1];
      }
    },
    click() {
      this.$nextTick(() => {
        let d = document.getElementsByClassName("cascader" + this.id);
        if (d[0] && !d[0].onclick) {
          d[0].onclick = function(e) {
            if (e.target.className == "el-cascader-node__label") {
              e.target.previousElementSibling.click();
            }
          };
        }
      });
    },
    async lazyLoad(node, resolve) {
      const { level } = node;
      if (level <= 3) {
        let req = {
          parent_id: level == 0 ? 0 : node.data.id
        };
        let res = {
          error_code: 0,
          data: {
            list: []
          }
        };
        if (node.root || node.hasChildren) {
          res = await this.$api.listFrontcategory(req);
        }
        if (res.error_code == 0) {
          let list = res.data.list || [];
          for (let i = 0; i < list.length; i++) {
            if (list[i].child_count == 0) {
              list[i].leaf = true;
            } else {
              list[i].leaf = false;
            }
          }
          return resolve([...list]);
        } else {
          return resolve([]);
        }
      } else {
        return resolve([]);
      }
    },
    radioChange(val) {
      this.currNav = {
        name: "",
        style: val, // 	导航类型 1:系统默认 2:列表3:网页
        url: "",
        category_path: [],
        selected_image: "",
        unselected_image: ""
      };
    },
    // // 取消编辑，刷新列表
    cancelEdit() {
      this.isEdit = false;
      this.queryList();
    },
    checkLink(url) {
      window.open(url);
    },
    edit(data, index) {
      this.editDg = true;
      this.currIndex = index;
      if (this.$refs.form) {
        // 清空新增时 的强制输入提示
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
      if (data) {
        this.currNav = JSON.parse(JSON.stringify(data));
        this.editTxt = "编辑";
      } else {
        this.editTxt = "添加";
        this.currNav = {
          name: "",
          style: 3, // 	导航类型 1:系统默认 2:列表3:网页
          url: "",
          category_path: [],
          selected_image: "",
          unselected_image: ""
        };
      }
    },
    async newNav() {
      this.currNav.type = this.search.type;
      let res = await this.$api.createAppNav(this.currNav);
      if (res.error_code == 0) {
        this.$message.success("添加成功");
        this.queryList();
        this.editDg = false;
      }
    },
    // 清空图片
    clearLoadImgs() {
      this.currNav.selected_image = "";
      this.currNav.unselected_image = "";
    },
    // 导航编辑 按钮 保存
    saveClick() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.editTxt == "添加") {
            this.newNav();
          } else {
            if (this.currNav.style == 2) {
              let t = this.$refs["cascader"].getCheckedNodes()[0].pathLabels;
              this.list[this.currIndex].name = t[t.length - 1];
            }
            this.list.splice(this.currIndex, 1, this.currNav);
            this.saveList();
          }
        }
      });
    },
    async removeClick(id) {
      this.$confirm("确定删除导航?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.deleteAppNav({
            list: [
              {
                id: id
              }
            ]
          });
          if (res.error_code == 0) {
            this.$message.info("已删除");
            this.queryList();
          }
        })
        // 不写 控制台 会有红提示
        .catch(() => {});
    },
    async saveList() {
      let res = await this.$api.updateNavList({
        type: this.search.type,
        list: this.list
      });
      if (res.error_code == 0) {
        this.$message.success("保存成功");
        this.queryList();
        this.editDg = false;
      } else {
        // 防止 编辑保存后报错后，本地数据还是编辑后的状态，给人已经编辑成功的错觉
        this.queryList();
      }
    },
    async queryList() {
      this.isEdit = false;
      let res = await this.$api.getAppTopNavList(this.search);
      if (res.error_code == 0) {
        this.list = res.data.list || [];
      }
    }
  }
};
</script>
<style lang="less">
// .el-cascader-panel .el-radio {
//   width: 100%;
//   height: 100%;
//   z-index: 10;
//   position: absolute;
//   top: 10px;
//   right: 10px;
// }
// .page .el-cascader-panel .el-radio__input {
//   visibility: hidden;
// }
// .page .el-cascader-panel .el-cascader-node__postfix {
//   top: 10px;
// }

.page {
  .wrapper {
    display: flex;
    flex: 1;
    .item {
      flex: 1;
    }
  }
  .drag {
    .item {
      background: #fff;
      padding: 16px 14px;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .right {
        .icon {
          margin-left: 16px;
          vertical-align: -4px;
          cursor: pointer;
        }
      }
      .left {
        flex: 1;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .header {
    display: flex;
    height: 50px;
    .left {
      display: flex;
      align-items: center;
      flex: 1;
      .title {
        font-size: 18px;
        font-weight: bold;
        padding-right: 20px;
      }
    }
  }
}
</style>
