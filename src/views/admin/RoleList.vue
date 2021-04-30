<template>
  <div class="role-list">
    <!-- top -->
    <el-form inline>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="addRoleClick"
          >创建角色</el-button
        >
      </el-form-item>
    </el-form>
    <!-- /top -->
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="name"></el-table-column>
      <el-table-column label="角色状态">
        <template slot-scope="scope">
          <p>
            <el-switch
              @change="changeStatus(scope.row)"
              v-model="scope.row.status"
              active-text="启用"
              inactive-text="禁用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <p>
            <el-button size="small" @click="editBtnClick(scope.row)"
              >修改</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!-- /table -->
    <!-- dialog -->
    <el-dialog title="创建/编辑角色" :visible.sync="editRoleDialog" width="60%">
      <el-form>
        <el-form-item label="角色名称">
          <el-input v-model="currentRole.name"></el-input>
        </el-form-item>
        <div class="title">权限分配</div>
        <div class="container">
          <!-- default-expand-all -->
          <el-tree
            v-if="editRoleDialog"
            ref="tree"
            check-strictly
            node-key="id"
            highlight-current
            :props="props"
            show-checkbox
            :default-checked-keys="currentRole.authorization"
            :data="authorization.list"
          ></el-tree>
        </div>
        <el-form-item>
          <el-button type="primary" @click="saveBtnClick">保存</el-button>
          <el-button @click="editRoleDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /dialog -->
  </div>
</template>
<script>
import authorization from "../../authTemp/authorization.json";

export default {
  data() {
    return {
      props: {
        label: "label",
        children: "children"
      },
      authIds: [], // 被勾选权限的id 列表
      list: [],
      authorization: authorization, //权限模板
      editRoleDialog: false,
      editType: 0, //新建还是编辑
      currentRole: {
        name: "",
        authorization: []
      },
      role: 0,
      //角色查询条件
      queryData: {
        id: "",
        name: "",
        status: -1 //-1： 默认 0：开了权限  1： 关闭权限
      },
      currentEditStatus: 1, //当前正在修改的角色的status
      isNew: true // 是否新建角色
    };
  },
  mounted() {
    this.queryRoleInfo();
  },
  methods: {
    //修改开关状态
    changeStatus(item) {
      this.update(item);
    },
    //更新角色信息
    async update(item) {
      let res = await this.$api.updateRoleInfo(item);
      if (res.error_code == 0) {
        this.$message.success("修改成功");
        this.queryRoleInfo();
      }
    },
    async queryRoleInfo() {
      let req = this.$initReq(this.queryData);
      let res = await this.$api.queryRoleInfo(req);
      if (res.error_code == 0) {
        this.list = res.data.list;
      } else {
        this.$message.error(res.error_description || "查询失败");
      }
    },
    //点击创建角色按钮
    addRoleClick() {
      this.isNew = true; //新建角色
      this.currentRole.name = "";
      this.currentRole.authorization = [];
      this.editRoleDialog = true;
      this.editType = 0; //新建
    },
    //点击保存按钮
    async saveBtnClick() {
      if (this.currentRole.name == "") {
        this.$message.error("请输入角色名称");
        return;
      }
      //新加角色
      if (this.editType == 0) {
        this.addRole();
      } else {
        // 部分页面只会选中部分权限， 会是半选中的状态，所以得把半选中的也要加上去
        this.authIds = this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys());
        //编辑角色
        this.update({
          id: this.currentRole.id,
          status: this.currentEditStatus,
          name: this.currentRole.name,
          page_level_permission: JSON.stringify(this.authIds)
        });
        this.editRoleDialog = false;
      }
    },
    async addRole() {
      let res = await this.$api.addRole({
        name: this.currentRole.name,
        status: 1,
        page_level_permission: JSON.stringify(this.authIds)
      });
      if (res.error_code == 0) {
        this.$message.success("角色创建成功");
        this.queryRoleInfo();
        this.editRoleDialog = false;
      } else {
        this.$message.error(res.error_description || "创建失败");
      }
    },
    //点击修改
    editBtnClick(item) {
      this.isNew = false; // 编辑角色
      this.role = item.id;
      let currAuth = JSON.parse(item.page_level_permission);
      //设置原始
      if (!Array.isArray(currAuth)) {
        currAuth = [];
      }
      this.currentRole.name = item.name;
      this.currentRole.id = item.id;
      this.currentRole.authorization = currAuth;
      this.editRoleDialog = true;
      this.editType = 1; //编辑
      this.currentEditStatus = item.status;
    }
  }
};
</script>
<style lang="less">
.role-list {
  .container {
    height: 400px;
    overflow: auto;
  }
}
</style>
