<template>
  <div class="page-apply-list">
    <!-- top -->
    <el-form inline>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.apply_status"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="全部"></el-option>
          <el-option :value="0" label="待审核"></el-option>
          <el-option :value="1" label="已通过"></el-option>
          <el-option :value="2" label="已拒绝"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.tel"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.source"
          @change="searchBtnClick"
          placeholder="请选择渠道"
        >
          <el-option label="所有渠道" value></el-option>
          <el-option
            v-for="item in $platformList"
            :label="item.name"
            :value="item.id + ''"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 140px"
          v-model="search.sort_type"
          @change="searchBtnClick"
        >
          <el-option :value="1" label="粉丝量从高到低"></el-option>
          <el-option :value="2" label="申请时间从新到旧"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.nickname"
          placeholder="博主昵称"
          @keyup.native.enter="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          placeholder="请选择责任人"
          v-model="search.liabler_email"
          @change="searchBtnClick"
        >
          <el-option label="全部责任人" value></el-option>
          <el-option
            v-for="(item, index) in liablerList"
            :key="index"
            :value="item.email"
            :label="item.name"
          ></el-option>
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
    <!-- top -->
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="联系方式" width="200">
        <template slot-scope="scope">
          <div>
            <p>手机：{{ scope.row.tel }}</p>
            <p>微信：{{ scope.row.wx }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="昵称"
        prop="nickname"
        min-width="200"
      ></el-table-column>
      <el-table-column label="申请渠道" width="200">
        <template slot-scope="scope">
          <p>
            <span
              class="platform"
              v-for="(item, index) in scope.row.source"
              :key="index"
              >{{ $getPlatformName(item) }}</span
            >
          </p>
        </template>
      </el-table-column>
      <el-table-column label="粉丝量" prop="fans_count"></el-table-column>
      <el-table-column label="邀请人/邀请人ID" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.imviter != '' || scope.row.inviter_id != ''">
            <p>{{ scope.row.inviter }}</p>
            <p>{{ scope.row.inviter_id }}</p>
            <!-- <p v-if="scope.row.inviter=='-'&& scope.row.inviter_id=='-'">-</p> -->
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="责任人" prop="liabler_name"> </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <p>
            <el-tag disable-transitions v-if="scope.row.apply_status == 0"
              >待审核</el-tag
            >
            <el-tag
              disable-transitions
              type="success"
              v-if="scope.row.apply_status == 1"
              >已通过</el-tag
            >
            <el-tag
              disable-transitions
              type="danger"
              v-if="scope.row.apply_status == 2"
              >已拒绝</el-tag
            >
          </p>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="200">
        <template slot-scope="scope">
          <p>
            {{ moment(scope.row.create_at * 1000).format("YYYY-MM-DD HH:mm") }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <p>
            <el-button
              @click="infoBtnClick(scope.row.id, scope.row.apply_status)"
              type="text"
              >查看详情</el-button
            >
            <template>
              <el-button
                v-if="
                  scope.row.apply_status == 0 && authList.indexOf('id73') > -1
                "
                @click="refuseBtnClick(scope.row.id)"
                type="text"
                >拒绝</el-button
              >
              <el-button
                v-if="
                  scope.row.apply_status == 0 && authList.indexOf('id75') > -1
                "
                @click="approveBtnClick(scope.row.id)"
                type="text"
                >通过</el-button
              >
            </template>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!-- /table -->
    <!-- pagination -->
    <div class="pagination" v-show="list.length">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        background
        :total="total"
        @current-change="currentChange"
        :current-page="search.page_id"
      ></el-pagination>
    </div>

    <el-dialog title="博主信息" :visible.sync="cpInfoDialog" width="800px">
      <el-form
        label-width="80px"
        label-position="left"
        :disabled="applyStatus != 0"
      >
        <!-- 个人信息 -->
        <div class="row-title">个人信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="真实姓名">
              <el-input v-model="cpInfo.real_name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机">
              <el-input v-model="cpInfo.tel" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="微信">
              <el-input v-model="cpInfo.wx" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 个人信息 -->
        <!-- 设置 -->
        <div class="row-title">设置</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="责任人">
              <el-select v-model="cpInfo.admin" value-key="email">
                <el-option
                  v-for="(item, index) in liablerList"
                  :key="index"
                  :value="item"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主渠道" required>
              <el-select
                v-model="clickMainSource"
                :disabled="cpInfo.main_source != ''"
              >
                <el-option
                  v-for="item in main_source_options"
                  :key="item"
                  :value="item"
                  :label="$getPlatformName(item)"
                ></el-option>
                <!-- <el-option v-for="item in cpInfo.apply_source" v-if="item.is_checked==1" :key="item.id" :value="item.id" :label="getPlatformName(item.id)"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="博主类目">
              <el-select
                v-model="cpInfo.category"
                multiple
                value-key="category_id"
              >
                <div style="padding:10px;">
                  <el-input
                    style="width:100px;"
                    :maxlength="10"
                    v-model.trim="newcategory"
                  ></el-input>
                  <el-button
                    :disabled="newcategory == ''"
                    @click="addCategoryBtnClick"
                    >新增</el-button
                  >
                </div>
                <el-option
                  v-for="item in category"
                  :value="item"
                  :label="item.category_name"
                  :key="item.category_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 设置 -->
        <div class="row-title">渠道申请</div>
        <el-table :data="cpInfo.apply_source">
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.is_checked"
                :true-label="1"
                :false-label="0"
                @change="
                  setMainSourceOptions(scope.row.id, scope.row.is_checked)
                "
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="申请渠道" width="100">
            <template slot-scope="scope">
              <p>{{ $getPlatformName(scope.row.id) }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="昵称"
            prop="platform_nickname"
            width="100"
          ></el-table-column>
          <el-table-column
            label="渠道ID"
            prop="platform_id"
            width="150"
          ></el-table-column>
          <el-table-column label="主页链接">
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="goPlatformUrl(scope.row.platform_url)"
                >{{ $getPlatformName(scope.row.id) }}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column label="主页图片">
            <template slot-scope="scope">
              <img
                v-if="scope.row.homepage_image"
                @click="checkImg(scope.row.homepage_image)"
                width="50px"
                height="50px"
                :src="scope.row.homepage_image"
                alt
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" v-if="authList.indexOf('id86') > -1">
        <el-button @click="cpInfoDialog = false">取消</el-button>
        <el-button @click="editBtnClick" type="primary">保存</el-button>
      </div>
    </el-dialog>
    <!-- /cpinfoDialog -->
    <!-- 主页截图 -->
    <el-dialog title="主页截图" :visible.sync="showImgDg">
      <img width="100%" :src="currImg" alt />
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import { goPlatformUrl } from "../../utils/platform";
export default {
  data() {
    return {
      goPlatformUrl: goPlatformUrl,
      refuseReason: "",
      currImg: "", // 当前截图
      showImgDg: false, // 查看主页截图dg
      applyStatus: 0, // 申请状态 0：待审核 1： 通过 2： 拒绝
      moment: moment,
      search: {
        sort_type: 1, // 1： 粉丝量从高到低 2： 申请时间从新到旧
        apply_status: 0, //-1全部
        liabler_email: "",
        nickname: "",
        page_id: 1,
        page_size: 10,
        tel: "", // 手机号
        source: "" // 渠道
      },
      list: [],
      total: 0,
      cpInfoDialog: false,
      cpInfo: {
        source: ""
      },
      main_source_options: [],
      category: [],
      newcategory: "",
      liablerList: [], //责任人列表
      clickMainSource: "", // 点击后展示的main_source 因为判定以已经设置了main_source就禁用改了，所以不能判定给cpInfo,不然一旦选择就没法改了，这个反人类
      showBtn: true // 控制展示审核按钮
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  created() {
    this.searchCpList();
    this.getCategory();
    this.getLiablerList(); //获取责任人列表
  },
  methods: {
    // open(id){
    //  this.setId=id,
    //  this.dialogVisible=true
    // },
    // 查看主页截图
    checkImg(img) {
      this.currImg = img;
      this.showImgDg = true;
    },
    //获取类目列表
    async getCategory() {
      let res = await this.$api.getCategories();
      if (res.error_code == 0) {
        this.category = res.data.category || [];
      }
    },
    //获取责任人列表
    async getLiablerList() {
      let res = await this.$api.getSchema({ name: "xiaoer.json" });
      if (res.error_code == 0) {
        this.liablerList = JSON.parse(res.data.content).formData.list || [];
      } else {
        this.$message.error("获取文件失败");
      }
    },
    //查询博主列表
    async searchCpList() {
      let res = await this.$api.queryBloggerInfo(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data ? res.data.list || [] : [];
        this.total = res.data ? res.data.total || 0 : 0;
      }
    },
    //搜索
    searchBtnClick() {
      this.search.page_id = 1;
      this.searchCpList();
    },
    //点击重置
    refreshBtnClick() {
      this.search = {
        apply_status: -1, //-1全部
        liabler_email: "",
        nickname: "",
        page_id: 1,
        page_size: 10,
        tel: "", // 手机号
        source: "" // 渠道
      };
      this.searchCpList();
    },
    //页码变更
    currentChange(current) {
      this.search.page_id = current;
      this.searchCpList();
    },
    //点击详情
    async infoBtnClick(id, applyStatus) {
      this.applyStatus = applyStatus;
      let res = await this.$api.cpApplyDetail({ id: id });
      if (res.error_code == 0) {
        this.cpInfo = res.data || {};
        this.cpInfo.category = this.cpInfo.category || []; //博主类目
        // this.cpInfo.apply_source = this.cpInfo.apply_source||[];
        //模拟数据
        this.cpInfo.apply_source = this.cpInfo.apply_source || []; //apply_source为申请的渠道
        this.clickMainSource = this.cpInfo.main_source; //main_source为主渠道
        // 设置 主渠道选项
        this.main_source_options = this.cpInfo.main_source
          ? [this.cpInfo.main_source]
          : this.cpInfo.source
          ? this.cpInfo.source.split(",")
          : [];

        // this.main_source_options=this.cpInfo.main_source?[this.cpInfo.main_source]:this.cpInfo.source?this.cpInfo.source.split(","):[];
        // 后端又做is_checked处理了。
        // this.initApplySource(this.cpInfo.apply_source, this.cpInfo.source)
        this.cpInfoDialog = true;
      }
    },
    //设置主渠道下拉选
    setMainSourceOptions(id, check) {
      //设置下拉选
      let source = this.cpInfo.source ? this.cpInfo.source.split(",") : [];
      if (check == 1) {
        source.push(id);
        this.cpInfo.source = [...new Set(source)].join(",");
      } else {
        source.splice(source.indexOf(id), 1); // 删除 对应渠道id
        this.cpInfo.source = source.join(",");
      }
      // 主渠道存在 不能修改主渠道，滚去 博主列表详情改。 主渠道不存在，那就只能设置成 当前申请的渠道
      this.main_source_options = this.cpInfo.main_source
        ? [this.cpInfo.main_source]
        : this.cpInfo.source
        ? this.cpInfo.source.split(",")
        : [];

      //去重渠道
      this.main_source_options = [...new Set(this.main_source_options)];
      //this.main_source_options = new Set();
      //如果当前选中的主渠道被勾选取消 清空
      if (
        this.main_source_options.every(item => {
          return item !== this.cpInfo.main_source;
        })
      ) {
        this.cpInfo.main_source = "";
      }
    },
    //点击确认修改信息
    async editBtnClick() {
      this.cpInfo.main_source = this.clickMainSource;
      if (this.cpInfo.main_source == "") {
        this.$message.error("请选择主渠道");
        return false;
      }
      // 当所有渠道都被清空，主渠道也要清空
      if (this.cpInfo.source == "") {
        this.cpInfo.main_source = "";
      }
      let res = await this.$api.editBloggerInfoById(this.cpInfo);
      if (res.error_code == 0) {
        this.$message.success("修改成功");
        this.searchCpList();
        this.cpInfoDialog = false;
      } else {
        this.$message.error("操作失败" + res.error_description);
      }
    },
    //点击新增类目
    async addCategoryBtnClick() {
      if (
        this.category.some(item => {
          return item.category_name == this.newcategory;
        })
      ) {
        this.$message.error("类目名称已存在");
        return false;
      }
      let res = await this.$api.addCategory({
        category_name: this.newcategory
      });
      if (res.error_code == 0) {
        this.newcategory = "";
        this.getCategory();
      } else {
        this.$message.error("类目名称添加失败");
      }
    },
    //拒绝入驻申请
    refuseBtnClick(id) {
      this.$confirm("是否拒绝该博主的渠道申请", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "再想想",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.refuseBlogger({ id: id }); //id 改成string
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.searchCpList();
          } else {
            this.$message.error("操作失败" + res.error_description);
          }
        })
        .catch(() => {
          return false;
        });
    },
    //点击通过按钮
    approveBtnClick(id) {
      this.$confirm("通过该博主的渠道申请", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "再想想",
        type: "success"
      })
        .then(async () => {
          let res = await this.$api.verifyBlogger({ id });
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.searchCpList();
          } else {
            this.$message.error("操作失败" + res.error_description);
          }
        })
        .catch(() => {
          return false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.page-apply-list {
  .platform + .platform {
    margin-left: 10px;
  }
  .row-title {
    color: #aeaeae;
    font-size: 16px;
    padding-left: 0px;
    line-height: 50px;
    text-align: left;
    border-top: 1px solid #e6e6e6;
  }
}
</style>
