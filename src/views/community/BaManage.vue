<template>
  <div class="community-list">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="映兔昵称"
          v-model.trim="search.nickname"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="映兔ID"
          maxlength="19"
          v-model.trim="search.ba_id"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="手机号"
          v-model.trim="search.phone"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          placeholder="微信号"
          v-model.trim="search.wx"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.ba_status"
          @change="searchBtnClick"
        >
          <el-option :value="0" label="全部状态"></el-option>
          <el-option :value="1" label="正常"></el-option>
          <el-option :value="2" label="失效"></el-option>
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
      <br />
      <el-form-item>
        <el-button
          type="primary"
          @click="addBA"
          v-if="authList.indexOf('id97') > -1"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="映兔昵称" prop="nickname"></el-table-column>
      <el-table-column label="映兔ID" prop="ba_id"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="微信号" prop="wx"></el-table-column>
      <el-table-column label="BA状态">
        <template slot-scope="scope">
          <p v-if="scope.row.ba_status == 1">正常</p>
          <p v-if="scope.row.ba_status == 2" style="color:red">失效</p>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="admin_id">
        <template slot-scope="scope">
          <p v-if="scope.row.admin_id == 0">admin</p>
          <p v-else>{{ allAdmin[scope.row.admin_id] }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <p>
            {{
              moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <p>
            <el-button type="text" @click="detailClick(scope.row)"
              >查看详情</el-button
            >
            <template v-if="authList.indexOf('id98') > -1">
              <el-button
                v-if="scope.row.ba_status == 1"
                type="text"
                @click="cancelClick(scope.row.ba_id)"
                >注销</el-button
              >
              <el-button
                v-if="scope.row.ba_status == 2"
                type="text"
                @click="restoreClick(scope.row.ba_id)"
                >恢复</el-button
              >
            </template>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!--page-->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        layout="total,prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page_id"
        :page-size="10"
        :total="count"
      ></el-pagination>
    </div>
    <!--/page-->
    <!-- 新增BA人员dialog -->
    <el-dialog title="新增BA用户" :visible.sync="addDialog" width="400px">
      <el-form label-width="100px" :model="addParams" ref="form" :rules="rules">
        <el-form-item label="映兔ID:" prop="id" label-width="80px">
          <el-input
            style="width:200px;"
            v-model.trim="addParams.id"
            placeholder="请输入"
            maxlength="19"
            @blur="getBaName"
          ></el-input>
        </el-form-item>
        <el-form-item label="映兔昵称：" label-width="90px">
          <span style="width:200px;">{{ nickname }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveBA">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情dialog -->
    <el-dialog title="查看详情" :visible.sync="detailDialog" width="900px">
      <el-form label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="映兔昵称：" prop="sponsor_id">
              <span>{{ showdetail.nickname }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="映兔ID：">
              <span>{{ showdetail.ba_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号：">
              <span>{{ showdetail.phone }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="微信号：">
              <span>{{ showdetail.wx }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间：">
              <span>{{
                moment(showdetail.create_time * 1000).format("YYYY-MM-DD HH:mm")
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：">
              <span v-if="showdetail.ba_status == 1">正常</span>
              <span v-else>失效</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-tabs v-model="tab" @tab-click="handleClick">
              <el-tab-pane label="近期分享" name="1"></el-tab-pane>
              <el-tab-pane label="任务积分" name="2"> </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-table :data="shareList" v-if="tab == '1'">
          <el-table-column label="时间" prop="create_time">
            <template slot-scope="scope">
              {{
                moment(scope.row.create_time * 1000).format("YYYY-MM-DD HH:mm")
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="分享商品名称"
            prop="production_name"
          ></el-table-column>
          <el-table-column label="点击量">
            <template slot-scope="scope">
              {{ scope.row.weapp_click_num + scope.row.code_click_num }}
            </template>
          </el-table-column>
          <el-table-column label="转化数" prop="weapp_conversion_num">
            <template slot-scope="scope">
              {{
                scope.row.weapp_conversion_num + +scope.row.code_conversion_num
              }}
            </template>
          </el-table-column>
        </el-table>
        <!-- <template> -->
        <el-table :data="scoreList" v-if="tab == '2'">
          <el-table-column label="时间" prop="month"
            ><template slot-scope="scope">{{
              scope.row.month
            }}</template></el-table-column
          >
          <el-table-column label="任务分" prop="total_score"></el-table-column>
          <el-table-column label="排名">
            <template slot-scope="scope">
              {{ scope.row.rank }}
            </template>
          </el-table-column>
        </el-table>
        <!-- </template> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      moment: moment,
      list: [],
      count: 0,
      addDialog: false,
      detailDialog: false,
      showdetail: "",
      tab: "1",
      shareList: [],
      scoreList: [],
      search: {
        ba_id: "",
        nickname: "",
        ba_status: 0,
        page_id: 1,
        page_size: 10,
        phone: "",
        wx: ""
      },
      nickname: "",
      addParams: {
        id: ""
      },
      rules: {
        id: [
          {
            required: true,
            message: "请输入ID",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.queryList();
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    },
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    }
  },
  watch: {
    "addParams.id"() {
      this.nickname = "";
    }
  },
  methods: {
    async queryList() {
      let res = await this.$api.getCommunityList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
      }
    },
    //新增BA人员
    addBA() {
      this.addParams.id = "";
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      this.addDialog = true;
    },
    //保存BA人员
    saveBA() {
      if (this.nickname == "") {
        this.$message.error("请验证映兔昵称");
        return false;
      }
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let req = {
            ba_id: this.addParams.id
          };
          let res = await this.$api.addNewBA(req);
          if (res && res.error_code == 0) {
            this.$message.success("添加成功!");
            this.addDialog = false;
            await this.queryList();
          }
        }
      });
    },
    //获取BA的昵称
    async getBaName() {
      if (this.addParams.id == "") {
        return false;
      }
      let req = {
        ba_id: this.addParams.id
      };
      let res = await this.$api.getBaNameSearch(req);
      if (res.error_code == 0) {
        this.nickname = res.data.nickname;
      } else {
        this.$message.error("获取失败,请核对id");
        this.nickname = "";
      }
    },
    //查看详情
    detailClick(item) {
      this.showdetail = item;
      this.tab = "1";
      this.detailDialog = true;
      this.handleClick();
    },
    //tab切换
    async handleClick() {
      let req = {
        ba_id: this.showdetail.ba_id
      };
      let res = await this.$api.getCurrentShareList(req);
      if (res.error_code == 0) {
        this.shareList = res.data.list;
      }
      if (this.tab == "2") {
        let res = await this.$api.getScoreList(req);
        if (res.error_code == 0) {
          this.scoreList = res.data.list;
        }
      }
    },
    //注销
    cancelClick(id) {
      let params = {
        ba_id: id,
        status: 2
      };
      this.updateStatus(params);
    },
    //恢复
    restoreClick(id) {
      let params = {
        ba_id: id,
        status: 1
      };
      this.updateStatus(params);
    },
    //修改状态
    updateStatus(item) {
      let message =
        item.status == 2 ? "注销该账号的BA权限？" : "恢复该账号的BA权限？";
      this.$confirm(message, "操作提示")
        .then(async () => {
          item.status = item.status.toString();
          let res = await this.$api.baStatusModify(item);
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.queryList();
          }
        })
        .catch(() => {
          return false;
        });
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.queryList();
    },
    //重置
    refreshBtnClick() {
      this.search = {
        ba_id: "",
        nickname: "",
        ba_status: 0,
        page_id: 1,
        page_size: 10,
        phone: "",
        wx: ""
      };
      this.searchBtnClick();
    }
  }
};
</script>

<style lang="less" scoped></style>
