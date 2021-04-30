<template>
  <div class="cate-list">
    <el-form inline>
      <el-form-item>
        <p>类目管理</p>
      </el-form-item>
      <el-form-item v-if="authList.indexOf('id111') > -1">
        <el-button @click="addBtnClick" icon="el-icon-plus">新增类目</el-button>
      </el-form-item>
    </el-form>

    <!--table-->
    <el-table :data="list" class="in-tabel">
      <el-table-column type="expand">
        <!-- type为expand时  slot-scope="props" 父子传值 -->
        <template slot-scope="props">
          <el-table :data="props.row.level_two_category" :show-header="false">
            <el-table-column
              type="index"
              :index="
                function() {
                  return;
                }
              "
            >
            </el-table-column>
            <!--跟父级对齐-->
            <el-table-column
              label="类目名称"
              prop="category_name"
            ></el-table-column>
            <el-table-column label="子类目数"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <p>
                  <el-button
                    v-if="authList.indexOf('id112') > -1"
                    @click="editBtnClick(scope.row, 2, props.row.category_name)"
                    type="text"
                    >编辑类目</el-button
                  >
                  <el-button
                    v-if="authList.indexOf('id113') > -1"
                    disabled
                    type="text"
                    >删除类目</el-button
                  >
                </p>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="类目名称" prop="category_name"></el-table-column>
      <el-table-column label="子类目数">
        <template slot-scope="scope">
          <p>{{ (scope.row.level_two_category || []).length }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <p>
            <el-button
              v-if="authList.indexOf('id112') > -1"
              @click="editBtnClick(scope.row, 1)"
              type="text"
              >编辑类目</el-button
            >
            <el-button v-if="authList.indexOf('id113') > -1" type="text"
              >删除类目</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!--/table-->
    <!-- dialog -->
    <el-dialog title="编辑类目" :visible.sync="dialogCate">
      <el-form label-width="100px">
        <el-form-item label="类目Id" v-if="category.category_id != '0'">
          <el-input v-model="category.category_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="类目类型">
          <el-select
            v-model="category.category_type"
            :disabled="category.category_id != '0'"
          >
            <el-option :value="1" label="一级类目"></el-option>
            <el-option :value="2" label="二级类目"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类目">
          <el-select
            v-model="category['level_one_category_name']"
            :disabled="
              category.category_id != '0' || category.category_type == 1
            "
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in list"
              :key="item.category_id"
              :value="item.category_name"
              :label="item.category_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类目名称">
          <el-input v-model="category.category_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="saveBtnClick" type="primary">确认提交</el-button>
          <el-button @click="dialogCate = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- /dialog -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      dialogCate: false,
      category: {
        category_id: "",
        category_name: ""
      }
    };
  },
  mounted() {
    this.listCate();
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    //类目类型
    "category.category_type": function(val) {
      //清空类目所属
      if (val == 1) this.category.level_one_category_name = "";
    }
  },
  methods: {
    //类目列表
    async listCate() {
      let res = await this.$api.categoryList({});
      if (res.error_code == 0) {
        this.list = res.data.categories || [];
      }
    },
    //新增类目
    addBtnClick() {
      this.category = { category_id: "0" };
      this.dialogCate = true;
    },
    //编辑类目
    editBtnClick(item, type, level_one_category_name) {
      this.category.category_id = item.category_id;
      this.category.category_name = item.category_name;
      this.category.category_type = type;
      this.category.level_one_category_name = level_one_category_name;
      this.dialogCate = true;
    },
    //保存提交
    saveBtnClick() {
      //验证表单
      if (!this.category.category_type) {
        this.$message.error("请选择类目类型");
        return false;
      }
      if (
        this.category.category_type == 2 &&
        !this.category.level_one_category_name
      ) {
        this.$message.error("请选择所属类目");
        return false;
      }
      if (!this.category.category_name) {
        this.$message.error("请输入类目名称");
        return false;
      }
      this.categoryModify();
    },

    async categoryModify() {
      let res = await this.$api.categoryModify(this.category);
      if (res.error_code == 0) {
        this.$message.success("编辑成功");
        this.dialogCate = false;
        this.listCate();
      }
    }
  }
};
</script>
<style>
.in-tabel .el-table__expanded-cell {
  padding: 0 !important;
}
</style>
<style lang="less" scoped>
.cate-list {
  width: 100%;
}
</style>
