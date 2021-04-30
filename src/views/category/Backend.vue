<template>
  <div class="page-backend">
    <div class="header">
      <span style="margin-right:20px">后台类目管理</span>
      <el-button @click="addBtnClick($refs.tree.root)"
        ><i class="el-icon-plus"></i>添加类目</el-button
      >
    </div>
    <!-- 头 -->
    <div class="block">
      <div class="tree-header">
        <div class="title">类目名称</div>
        <div class="number">类目数量</div>
        <div class="operation">操作</div>
      </div>
      <el-tree
        ref="tree"
        :props="props"
        :load="loadNode"
        node-key="id"
        :indent="10"
        lazy
        :expand-on-click-node="false"
      >
        <!-- :default-expanded-keys="[1, 2, 3]" -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <!-- node为当前节点的Node对象，data为当前节点的数据 -->
          <span class="node-label">{{ data.name }}</span>
          <span class="node-length" v-if="node.loaded == false">{{
            data.child_count
          }}</span>
          <span class="node-length" v-else>{{ node.childNodes.length }}</span>
          <span class="node-operation">
            <el-button
              type="text"
              @click="addBtnClick(data, node)"
              v-if="node.level < 4"
            >
              添加子类目
            </el-button>
            <el-button type="text" @click="updateBtnClick(data, node)">
              编辑类目
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>

    <!-- 添加类目Dialog -->
    <el-dialog title="添加类目" :visible.sync="addDialog">
      <el-form>
        <el-form-item label="类目名称">
          <el-input
            v-model="add.label"
            type="text"
            style="width:200px"
            @keydown.native="keydown($event)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="addSubmit">确认</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <!-- 编辑类目Dialog -->
    <el-dialog title="编辑类目" :visible.sync="editDialog">
      <el-form label-width="100px">
        <el-form-item label="类目ID">
          <el-input
            v-model="category.id"
            disabled
            style="width:195px"
          ></el-input>
        </el-form-item>
        <el-form-item label="类目级数">
          <el-select v-model="category.level" disabled>
            <el-option :value="1" label="一级类目"></el-option>
            <el-option :value="2" label="二级类目"></el-option>
            <el-option :value="3" label="三级类目"></el-option>
            <el-option :value="4" label="四级类目"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类目" v-if="category.level > 1">
          <el-input
            v-model="category.parent_name"
            disabled
            style="width:195px
          "
          ></el-input>
        </el-form-item>
        <el-form-item label="类目名称">
          <el-input
            v-model.trim="category.name"
            @keydown.native="keydown($event)"
            style="width:195px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editConfirm">确认</el-button>
          <el-button @click="editDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      add: {
        label: ""
      },
      category: {},
      category1: [],
      data: [],
      node: "",
      addDialog: false,
      editDialog: false,
      verifyDisable: false,
      props: {
        label: "name",
        value: "id",
        isLeaf: "leaf"
      },
      count: 1
    };
  },
  methods: {
    //防止标签名里面输入空格
    keydown(event) {
      if (event.keyCode == 32) {
        event.returnValue = false;
      }
    },
    async loadNode(node, resolve) {
      if (node.level <= 3) {
        let req = {
          parent_id: node.level == 0 ? 0 : node.data.id
        };
        let res = await this.$api.listBackCategory(req);
        if (res.error_code == 0) {
          let list = res.data.list || [];
          for (let i = 0; i < list.length; i++) {
            //提前告知是否有子节点
            if (list[i].child_count > 0) {
              list[i].leaf = false;
            } else {
              list[i].leaf = true;
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
    addBtnClick(data, node) {
      this.addDialog = true;
      this.add.label = "";
      this.node = node;
    },

    async addSubmit() {
      if (this.add.label == "") {
        this.$message.error("请输入类目名称");
        return false;
      }
      let req = {
        parent_id: 0,
        name: this.add.label
      };
      if (this.node) {
        req.parent_id = this.node.data.id;
      } else {
        req.parent_id = 0;
      }
      if (this.verifyDisable) {
        this.$message.error("请勿重复点击");
        return false;
      }
      this.verifyDisable = true; // 防止重复点击
      let res = await this.$api.createBackCategory(req);
      this.verifyDisable = false;
      if (res.error_code == 0) {
        this.$message.success("添加成功");
        this.addDialog = false;
        this.partialRefreshpartialRefresh(this.node);
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
    updateBtnClick(data, node) {
      this.editDialog = true;
      this.node = node.parent;
      this.category = {
        id: data.id,
        level: node.level,
        parent_name: node.level > 1 ? node.parent.data.name : "",
        name: data.name
      };
    },
    async editConfirm() {
      if (this.category.name == "") {
        this.$message.error("请输入类目名称");
        return false;
      }
      let params = {
        id: this.category.id,
        name: this.category.name
      };
      let res = await this.$api.updateBackCategory(params);
      if (res.error_code == 0) {
        this.$message.success("修改成功！");
        this.partialRefreshpartialRefresh(this.node);
        this.editDialog = false;
      }
    }
  }
};
</script>
<style lang="less">
.page-backend {
  .el-tree-node__content {
    height: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
<style lang="less" scoped>
.page-backend {
  .block {
    background: #fff;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
    margin-top: 20px;
    > .tree-header {
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
      > .operation {
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
  .node-operation {
    width: 200px;
  }
}
</style>
