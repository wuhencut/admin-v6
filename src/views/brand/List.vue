<template>
  <div class="brand-list">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.brand_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="品牌名称"
        ></el-input>
        <input type="text" hidden />
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.brand_level"
          placeholder="品牌等级"
          @change="searchBtnClick"
        >
          <el-option value label="全部等级"></el-option>
          <el-option
            v-for="level in levelList"
            :key="level.value"
            :label="level.label"
            :value="level.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtnClick" icon="el-icon-search"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item v-if="authList.indexOf('id104') > -1">
        <el-button @click="addBtnClick" icon="el-icon-plus">新增品牌</el-button>
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="品牌Id"
        prop="brand_id"
        width="100"
      ></el-table-column>
      <el-table-column label="品牌LOGO" width="200">
        <template slot-scope="scope">
          <img class="logo-img" :src="scope.row.brand_logo" />
        </template>
      </el-table-column>
      <el-table-column label="品牌名称" prop="brand_name"></el-table-column>
      <el-table-column label="品牌等级" prop="brand_level"> </el-table-column>
      <el-table-column label="相关操作" width="300">
        <template slot-scope="scope">
          <p>
            <el-button
              v-if="authList.indexOf('id102') > -1"
              @click="editBtnClick(scope.row)"
              type="text"
              >编辑品牌</el-button
            >
            <el-button
              v-if="authList.indexOf('id103') > -1"
              type="text"
              disabled
              >删除品牌</el-button
            >
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!-- /table -->
    <!--page-->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page"
        :page-size="20"
        :total="count"
      ></el-pagination>
    </div>
    <!--/page-->
    <el-dialog title="编辑品牌信息" :visible.sync="dialogBrand">
      <el-form label-width="100px">
        <el-form-item label="品牌Id">
          <el-input disabled v-model="brand.brand_id"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input v-model="brand.brand_name"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO">
          <upload-img v-model="brand.brand_logo"></upload-img>
        </el-form-item>
        <el-form-item label="品牌等级">
          <el-select v-model="brand.brand_level">
            <el-option
              v-for="(level, index) in levelList"
              :key="index"
              :label="level.label"
              :value="level.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌故事">
          <el-input
            v-model="brand.brand_story"
            type="textarea"
            :autosize="{ minRows: 2 }"
            :maxlength="120"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="saveBtnClick" type="primary">确认提交</el-button>
          <el-button @click="dialogBrand = false">取消</el-button>
        </el-form-item>
      </el-form>
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
      search: {
        brand_name: "",
        page_id: 1,
        page_size: 10 //page_size无效，不传了
      },
      list: [],
      count: 0,
      dialogBrand: false,
      brand: {
        brandLevel: "" // 0全部 1：B， 2： A， 3： KA  品牌等级
      },
      levelList: [
        {
          // 品牌等级列表
          value: "B",
          label: "B"
        },
        {
          value: "A",
          label: "A"
        },
        {
          value: "KA",
          label: "KA"
        },
        {
          value: "无等级",
          label: "无等级"
        }
      ]
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  mounted() {
    this.searchBrand();
  },
  methods: {
    searchBtnClick() {
      this.search.page_id = 1;
      this.searchBrand();
    },
    async searchBrand() {
      let req = this.$initReq(this.search);
      let res = await this.$api.brandSearch(req);
      if (res.error_code == 0) {
        this.list = res.data.brands || [];
        this.count = res.data.count || 0;
      }
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.searchBrand();
    },
    //编辑信息
    editBtnClick(item) {
      this.brand = JSON.parse(JSON.stringify(item));
      this.dialogBrand = true;
    },
    //点击新增按钮
    addBtnClick() {
      this.brand = {};
      this.dialogBrand = true;
    },
    //确认提交
    async saveBtnClick() {
      if (
        this.brand.brand_name &&
        this.brand.brand_logo &&
        this.brand.brand_level
      ) {
        let res = await this.$api.brandModify(this.brand);
        if (res.error_code == 0) {
          this.$message.success("编辑成功");
          this.searchBrand();
          this.dialogBrand = false;
        }
      } else {
        this.$message.info("请完善名称、logo和品牌等级");
        return false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.brand-list {
  .pagination {
    text-align: center;
    margin: 10px 0;
  }
  .logo-img {
    width: 50px;
    height: 50px;
    border: 1px solid #dcdfe6;
  }
}
</style>
