<template>
  <div class="config-list">
    <!-- header -->
    <el-form inline>
      <el-form-item>
        <p>配置管理</p>
      </el-form-item>
      <el-form-item>
        <el-button @click="addBtnClick" icon="el-icon-plus">新增配置</el-button>
      </el-form-item>
    </el-form>
    <!-- /header -->
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="配置文件" prop="name"></el-table-column>
      <el-table-column label="相关操作" width="300">
        <template slot-scope="scope">
          <p>
            <el-button @click="formBtnClick(scope.row)" type="text"
              >填写表单</el-button
            >
            <el-button @click="editBtnClick(scope.row)" type="text"
              >更改配置</el-button
            >
            <el-button @click="delBtnClick(scope.row)" type="text"
              >删除配置</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!-- /table -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.listConfig();
  },
  methods: {
    //获取配置文件列表
    async listConfig() {
      let res = await this.$api.listSchema({});
      if (res.error_code == 0) {
        this.list = res.data || [];
      } else {
        this.$message.error(res.msg);
      }
    },
    //删除配置文件
    delBtnClick(item) {
      this.$confirm("确定删除配置文件？", "删除提示")
        .then(async () => {
          let res = await this.$api.deleteSchema({ name: item.name });
          if (res.error_code == 0) {
            this.listConfig();
            this.$message.success("操作成功");
          } else {
            this.$message.error("操作失败" + res.msg);
          }
        })
        .catch(() => {
          return false;
        });
    },
    //新增配置
    addBtnClick() {
      this.$router.push({
        name: "configEdit"
      });
    },
    //编辑配置
    editBtnClick(item) {
      this.$router.push({
        name: "configEdit",
        query: {
          name: item.name
        }
      });
    },
    formBtnClick(item) {
      this.$router.push({
        name: "configForm",
        query: {
          name: item.name
        }
      });
    }
  }
};
</script>
