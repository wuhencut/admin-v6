<template>
  <div class="page-frontend">
    <div class="breadcrumb">
      <span style="margin-right:20px;">前台类目管理</span>
      <el-button @click="addBtnClick($refs.tree.root, { id: 0 })">
        <i class="el-icon-plus"></i>
        添加类目
      </el-button>
    </div>
    <!-- 头部 -->
    <div class="tree-block">
      <!-- 头部 -->
      <div class="tree-hesder">
        <div class="title">类目名称</div>
        <div class="number">子类目数</div>
        <div class="oprtion">操作</div>
      </div>
      <!-- 头部 -->
      <!-- 树 -->
      <el-tree
        ref="tree"
        :indent="20"
        lazy
        :props="props"
        :load="loadNode"
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span class="node-label">{{ data.name }}</span>
          <span class="node-length" v-if="node.loaded == false">{{
            data.child_count
          }}</span>
          <span class="node-length" v-else>{{ node.childNodes.length }}</span>
          <span class="node-opration">
            <el-button
              type="text"
              @click="addBtnClick(node, data)"
              v-if="node.level < 4"
            >
              添加子类目
            </el-button>
            <el-button type="text" @click="deleteBtnClick(node, data)">
              删除类目
            </el-button>
            <el-button type="text" @click="updateBtnClick(node, data)">
              编辑类目
            </el-button>
          </span>
        </span>
      </el-tree>
      <!-- 树 -->
    </div>
    <!-- 头部 -->
    <!-- 添加子类目 -->
    <el-dialog title="添加类目" :visible.sync="addForm.visible" width="600px">
      <el-form label-width="100px">
        <el-form-item label="类目名称">
          <el-input
            v-model="addForm.name"
            @keydown.native="keydown($event)"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联后台类目">
          <el-cascader
            style="width:100%"
            v-if="addForm.visible"
            v-model="addForm.category"
            separator="-"
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addForm.visible = false">取消</el-button>
        <el-button type="primary" @click="submitAddClick">确认</el-button>
      </div>
    </el-dialog>
    <!-- 添加子类目 -->
    <!-- 编辑类目 -->
    <el-dialog
      title="编辑类目"
      :visible.sync="updateForm.visible"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="类目ID">
          <el-input v-model="updateForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="类目类型">
          <el-input v-model="updateForm.level" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属类目" v-if="updateForm.level != '一级类目'">
          <el-input v-model="updateForm.parent_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="类目名称">
          <el-input
            v-model="updateForm.name"
            @keydown.native="keydown($event)"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联类目">
          <el-cascader
            v-model="updateForm.category"
            style="width:100%"
            v-if="updateForm.visible"
            separator="-"
            :options="cascaderOptions"
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="updateForm.visible = false">取消</el-button>
        <el-button type="primary" @click="submitUpdateClick">确认</el-button>
      </div>
    </el-dialog>
    <!-- 编辑类目 -->
    <!-- 删除类目dialog -->
    <el-dialog title="删除类目" :visible.sync="dialogDel" width="33%">
      <span>
        确认删除
        <span style="color:blue"> {{ trans.name }}</span
        >这个前台商品类目？
      </span>
      <p>类目删除后,会影响App端商品类目的展示,请谨慎操作</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="deleteLabel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除类目dialog -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      node: null,
      trans: {},
      verifyDisable: false,
      props: {
        label: "name",
        isLeaf: "leaf"
      },
      addForm: {
        visible: false,
        parent_id: "",
        name: "",
        category: []
      },
      updateForm: {
        visible: false,
        id: "",
        name: "",
        level: "一级类目",
        category: [],
        category_name: []
      },
      dialogDel: false,
      cascaderOptions: [],
      category_array: [],
      cascaderProps: {
        multiple: true,
        checkStrictly: true,
        lazy: true,
        lazyLoad: this.lazyLoad,
        value: "id",
        label: "name",
        leaf: "leaf"
      }
    };
  },
  methods: {
    //防止标签名里面输入空格
    keydown(event) {
      if (event.keyCode == 32) {
        event.returnValue = false;
      }
    },
    //加载类目模板
    async lazyLoad(node, resolve) {
      //判断是否是选中的节点
      let cate = undefined;
      if (this.addForm.visible) {
        cate = [...this.addForm.category].find(item => {
          return item[item.length - 1] == node.value;
        });
      } else {
        cate = [...this.updateForm.category].find(item => {
          return item[item.length - 1] == node.value;
        });
      }
      let parent_id = 0;
      let category_id = 0;
      if (node.level > 0) {
        parent_id = node.data.id;
      }
      if (this.node.data) {
        category_id = this.node.data.id;
      }
      let req = {
        parent_id: parent_id,
        category_id: category_id
      };
      let res = {
        error_code: 0,
        data: {
          list: []
        }
      };
      if (node.root || (node.hasChildren && node.children.length == 0)) {
        res = await this.$api.getFrontcategoryTemp(req);
      }
      if (res.data == null) {
        res.data = {
          list: []
        };
      }
      if (res.error_code == 0) {
        res.data.list = res.data.list || [];
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].child_count == 0) {
            res.data.list[i].leaf = true;
          } else {
            res.data.list[i].leaf = false;
          }
        }
        if (node.children && node.children.length > 0) {
          resolve([]);
        } else {
          resolve([...res.data.list]);
          if (cate) {
            node.checked = true;
            if (this.addForm.visible) {
              this.addForm.category.push(cate);
              this.addForm.category = Array.from(
                new Set(this.addForm.category)
              );
            } else {
              this.updateForm.category.push(cate);
              this.updateForm.category = Array.from(
                new Set(this.updateForm.category)
              );
            }
          }
        }
        // if (node.level == 0 && this.updateForm.visible) {
        //   this.cascaderOptions = [...res.data.list];
        //   this.initCascaderOptions(this.cascaderOptions);
        // }
      } else {
        resolve([]);
      }
    },
    //加载类目
    async loadNode(node, resolve) {
      let parent_id = 0;
      if (node.level > 0) {
        parent_id = node.data.id;
      }
      let req = {
        parent_id: parent_id
      };

      let res = await this.$api.listFrontcategory(req);
      if (res.error_code == 0) {
        let list = res.data.list || [];
        for (let i = 0; i < list.length; i++) {
          if (list[i].child_count > 0) {
            list[i].leaf = false;
          } else {
            list[i].leaf = true;
          }
        }
        return resolve([...list]);
      }
    },
    partialRefreshpartialRefresh(node) {
      if (node) {
        node.loaded = false;
        node.expand();
      } else {
        this.reload(); //刷新整个页面
      }
    },
    //刷新整个树
    reload() {
      this.$refs.tree.root.loaded = false;
      this.$refs.tree.root.expand();
    },
    //添加子类目
    addBtnClick(node, data) {
      this.addForm.visible = true;
      this.node = node;
      this.node.data = data;
      this.addForm.parent_id = data.id;
      this.addForm.name = "";
      this.addForm.category = [];
      this.cascaderOptions = [];
    },
    //新增类目点击确认
    async submitAddClick() {
      let req = {
        parent_id: this.addForm.parent_id,
        name: this.addForm.name,
        category: this.addForm.category
      };
      if (req.name == "") {
        this.$message.error("请输入类目名称");
        return false;
      }
      if (req.category.length == 0) {
        this.$message.error("请选择关联类目");
        return false;
      }
      if (this.verifyDisable) {
        this.$message.error("请勿重复点击");
        return false;
      }
      this.verifyDisable = true; // 防止重复点击
      let res = await this.$api.createFrontCategory(req);
      this.verifyDisable = false;
      if (res.error_code == 0) {
        this.partialRefreshpartialRefresh(this.node);
        this.addForm.visible = false;
      }
    },
    //编辑类目
    async updateBtnClick(node, data) {
      this.node = node.parent;
      this.updateForm.id = data.id;
      this.updateForm.name = data.name;
      this.updateForm.level = ["一级类目", "二级类目", "三级类目", "四级类目"][
        node.level - 1
      ];
      this.updateForm.parent_name = node.level > 1 ? node.parent.data.name : "";
      this.updateForm.category = data.category || [];
      // this.updateForm.category_name = data.category_name || [];
      let cateArray = [];
      for (let i = 0; i < this.updateForm.category.length; i++) {
        for (let j = 0; j < this.updateForm.category[i].length - 1; j++) {
          cateArray.push(this.updateForm.category[i][j]);
        }
      }
      cateArray = Array.from(new Set(cateArray));
      this.initOptions(cateArray);
    },
    //初始化category
    async initOptions(cateArray) {
      let req = {
        parent_id: 0,
        category_id: this.node.id || 0
      };
      let res = await this.$api.getFrontcategoryTemp(req);
      if (res.error_code == 0 && res.data && res.data.list) {
        this.cascaderOptions = await this.loadOptions(
          res.data.list || [],
          cateArray
        );
        this.updateForm.visible = true;
      }
    },
    //递归加载子类目
    async loadOptions(category, cateArray) {
      //这里的category初始是第一级的类目
      let array = [];
      for (let i = 0; i < category.length; i++) {
        if (category[i].child_count == 0) {
          category[i].leaf = true;
        }
        if (category[i].child_count > 0 && cateArray.includes(category[i].id)) {
          let req = {
            parent_id: category[i].id,
            category_id: this.node.id || 0
          };
          let res = await this.$api.getFrontcategoryTemp(req);
          if (res.error_code == 0 && res.data && res.data.list) {
            category[i].children = await this.loadOptions(
              res.data.list,
              cateArray
            );
          }
        }
        array.push(category[i]);
      }
      return array;
    },
    //点击确认编辑
    async submitUpdateClick() {
      let req = {
        id: this.updateForm.id,
        name: this.updateForm.name,
        category: this.updateForm.category
      };
      if (req.name == "") {
        this.$message.error("请输入类目名称");
        return false;
      }
      if (
        req.category.length == 0 &&
        this.updateForm.category_name.length == 0
      ) {
        this.$message.error("请选择关联类目");
        return false;
      }
      let res = await this.$api.updateFrontCategory(req);
      if (res.error_code == 0) {
        this.$message.success("修改成功！");
        this.partialRefreshpartialRefresh(this.node);
        this.updateForm.visible = false;
      }
    },
    //点击删除
    deleteBtnClick(node, data) {
      this.dialogDel = true;
      this.node = node.parent;
      this.trans = data;
    },
    //确认删除
    async deleteLabel() {
      let req = {
        id: this.trans.id
      };
      let res = await this.$api.deleteFrontCategory(req); //删除标签接口
      if (res.error_code == 0) {
        this.$message.success("删除成功");
        this.dialogDel = false;
        this.partialRefreshpartialRefresh(this.node);
      }
    }
  }
};
</script>
<style lang="less">
.page-frontend {
  .el-tree-node__content {
    height: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
<style lang="less" scoped>
.page-frontend {
  .tree-block {
    background: #fff;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
    margin-top: 20px;
    > .tree-hesder {
      display: flex;
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e6e6e6;
      > .title {
        flex: 1;
      }
      > .number {
        width: 200px;
      }
      > .oprtion {
        width: 200px;
      }
    }
  }
  .custom-tree-node {
    width: 100%;
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    padding-right: 10px;
  }
  .node-label {
    flex: 1;
  }
  .node-length {
    width: 200px;
  }
  .node-opration {
    width: 200px;
  }
}
</style>
