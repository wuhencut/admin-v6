<template>
  <div class="cp-contact">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          @keyup.enter.native="searchBtnClick"
          v-model.trim="search.cp_id"
          placeholder="映兔ID"
          maxlength="19"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          @keyup.enter.native="searchBtnClick"
          v-model.trim="search.cp_nickname"
          placeholder="映兔昵称"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.judge_method" @change="searchBtnClick">
          <el-option label="全部判断维度" :value="0"></el-option>
          <el-option label="收货地址相同" :value="1"></el-option>
          <el-option label="收货电话相同" :value="2"></el-option>
          <el-option label="微信ID相同" :value="3"></el-option>
          <el-option label="收货人姓名相同" :value="4"></el-option>
          <el-option label="入驻姓名相同" :value="5"></el-option>
          <el-option label="支付宝ID相同" :value="6"></el-option>
          <el-option label="注册与收货电话相同" :value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtnClick" type="primary" icon="el-icon-search"
          >搜索</el-button
        >
        <el-button @click="refreshBtnClick" icon="el-icon-refresh"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="映兔昵称">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.cp_name_list" :key="index">
            {{ item }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="映兔ID">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.cp_id" :key="index">
            {{ item }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="判断维度">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.judge_method" :key="index">
            {{ methodsType[item - 1] }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="getDetail(scope.row)"
              >查看详情</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--外面分页-->
    <div class="pagination" v-if="total !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--外面分页 end-->
    <!-- 查看详情detail -->
    <el-dialog title="查看详情" :visible.sync="detailDg" width="1000px">
      <table border="0" style="border: 1px solid #ccc" rules="rows">
        <tr>
          <th style="width:300px;height:30px;">映兔昵称</th>
          <th style="width:300px;">映兔ID</th>
        </tr>
        <tr style="height:35px">
          <td>
            <div
              align="center"
              v-for="(item, index) in cp_name_list"
              :key="index"
              style="margin-top:5px"
            >
              {{ item }}
            </div>
          </td>
          <td>
            <div
              align="center"
              v-for="(item, index) in cp_id_list"
              :key="index"
              style="margin-top:5px"
            >
              {{ item }}
            </div>
          </td>
        </tr>
      </table>

      <el-table :data="innerList" style="margin-top:20px">
        <el-table-column label="账号" prop="cp_name1"> </el-table-column>
        <el-table-column label="账号" prop="cp_name2"> </el-table-column>
        <el-table-column label="判断纬度">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.judge_method" :key="index">
              {{ methodsType[item - 1] }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="关联系数">
          <template slot-scope="scope">
            <p
              v-if="
                scope.row.similarity_coefficient >= 0.8 ||
                  scope.row.modify_status == 1
              "
            >
              同人
            </p>
            <p
              v-if="
                scope.row.modify_status == 0 &&
                  scope.row.similarity_coefficient < 0.8
              "
            >
              疑似
            </p>
            ({{ scope.row.similarity_coefficient }})
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="relevance(scope.row)"
                v-if="
                  scope.row.modify_status == 0 &&
                    scope.row.similarity_coefficient < 0.8 &&
                    authList.indexOf('id95') > -1
                "
                >关联</el-button
              >
              <el-button
                type="text"
                @click="irrelevance(scope.row)"
                v-if="
                  scope.row.modify_status == 1 && authList.indexOf('id96') > -1
                "
                >撤销</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="innertotal"
          @current-change="currentChange"
          :page-size="innersearch.page_size"
          :current-page="innersearch.page_id"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDg = false">取 消</el-button>
        <el-button type="primary" @click="detailDg = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailDg: false, //查看详情dg
      cancelDg: false, //撤销dg
      list: [],
      cp_id_list: [],
      cp_name_list: [],
      group_id: "",
      innerList: [],
      innertotal: 0,
      total: 1,
      methodsType: [
        "收货地址相同",
        "收货电话相同",
        "微信ID相同",
        "收货人姓名相同",
        "入驻姓名相同",
        "支付宝ID相同",
        "注册与收货电话相同"
      ],
      innersearch: {
        page_id: 1,
        page_size: 5
      },
      search: {
        cp_id: "",
        cp_nickname: "",
        judge_method: 0,
        page_id: 1,
        page_size: 10
      }
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  mounted() {
    this.listCate();
  },
  methods: {
    //获取列表
    async listCate() {
      let res = await this.$api.getGroupList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.group;
        this.total = res.data.count;
      }
    },
    //点击详情
    async getDetail(item) {
      this.cp_id_list = item.cp_id;
      this.cp_name_list = item.cp_name_list;
      this.group_id = item.group_id;
      this.innersearch.page_id = 1;
      this.detailDg = true;
      this.getGroupDetail();
    },
    async getGroupDetail() {
      let req = {
        group_id: this.group_id.toString(),
        page_id: this.innersearch.page_id,
        page_size: this.innersearch.page_size
      };
      let res = await this.$api.getGroupDetailList(req);
      if (res.error_code == 0) {
        this.innerList = res.data.similar_pair;
        this.innertotal = res.data.count;
      }
    },
    //关联相似人
    async relevance(item) {
      let req = {
        cp_id1: item.cp_id1,
        cp_id2: item.cp_id2
      };
      let res = await this.$api.relatedGroup(req);
      if (res.error_code == 0) {
        this.$message.success("关联成功");
        this.getGroupDetail();
      }
    },
    //撤销疑似关联
    async irrelevance(item) {
      let req = {
        cp_id1: item.cp_id1,
        cp_id2: item.cp_id2
      };
      let res = await this.$api.cancelGroup(req);
      if (res.error_code == 0) {
        this.$message.success("撤销成功");
        this.getGroupDetail();
      }
    },
    //弹框里的分页
    currentChange(current) {
      this.innersearch.page_id = current;
      this.getGroupDetail();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.listCate();
    },
    //重置
    refreshBtnClick() {
      this.search = {
        cp_id: "",
        cp_nickname: "",
        judge_method: 0,
        judge_type: 0,
        page_id: 1,
        page_size: 10
      };
      this.searchBtnClick();
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.listCate();
    }
  }
};
</script>
