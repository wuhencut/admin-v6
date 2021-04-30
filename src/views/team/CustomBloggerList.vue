<template>
  <div class="blogger-list">
    <div class="header">
      <el-form inline>
        <el-form-item>
          <el-input
            placeholder="映兔ID"
            v-model.trim="f_cp_id"
            :disabled="disabled1"
            class="search-inp"
            maxlength="19"
            @keyup.enter.native="searchBtnClick"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <blogger-search
            v-model.trim="s_nickname"
            @select="handleSelectthree"
            :disabled="disabled2"
            @changeState="changeState"
            placeholder="映兔昵称"
          ></blogger-search>
        </el-form-item>
        <el-form-item>
          <blogger-select
            isOut
            v-model="search.operator_id"
            class="search-inp"
            @change="searchBtnClick"
          ></blogger-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.source"
            class="search-inp"
            @change="searchBtnClick"
          >
            <el-option value label="全部合作类型"></el-option>
            <el-option
              v-for="(item, index) in source"
              :key="index"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <team-search
            v-model="team_name"
            @select="handleSelectone"
          ></team-search>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.status"
            class="search-inp"
            @change="searchBtnClick"
          >
            <el-option value label="联盟状态"></el-option>
            <el-option label="正常" :value="1"></el-option>
            <el-option label="已关闭" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchBtnClick"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="primary"
            @click="updateBlogger(0)"
            v-if="authList.indexOf('id1611663514') > -1"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table :data="list">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="映兔ID" prop="cp_id"></el-table-column>
        <el-table-column label="映兔昵称" prop="nickname"></el-table-column>
        <el-table-column label="负责人">
          <template slot-scope="scope">
            {{ allAdmin[scope.row.operator_id] }}
          </template>
        </el-table-column>
        <el-table-column label="合作渠道">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.source" :key="index">
              {{ $getPlatformName(item) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="联盟战队" prop="team_name"></el-table-column>
        <el-table-column label="联盟状态">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 1">正常</p>
            <p v-else>已关闭</p>
          </template>
        </el-table-column>
        <el-table-column label="是否开通云账户">
          <template slot-scope="scope">
            <p v-if="scope.row.yun_status == true">是</p>
            <p v-else>否</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="updateBlogger(1, scope.row)"
              v-if="authList.indexOf('id1611663495') > -1"
              >查看</el-button
            >
            <el-button
              type="text"
              v-if="
                scope.row.status == 1 && authList.indexOf('id1611663555') > -1
              "
              @click="authorityClose(scope.row.cp_id)"
              >关闭权限
            </el-button>
            <el-button
              type="text"
              v-if="
                scope.row.status == 2 && authList.indexOf('id1611663555') > -1
              "
              @click="updateBlogger(2, scope.row)"
              >重启权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <!-- 添加联盟博主弹窗 -->
    <el-dialog
      :title="['添加博主', '查看详情', '重启权限'][flag]"
      :visible.sync="bloggerDg"
      width="800px"
    >
      <el-form
        width="90px"
        label-position="left"
        :model="bloggerItem"
        :disabled="reopen"
      >
        <p style="font-size:16px;margin-bottom:15px"><b>合作信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="映兔ID" label-width="80px" prop="cp_id">
              <el-input
                style="width:200px"
                v-model.trim="bloggerItem.cp_id"
                @blur="getMessage(bloggerItem.cp_id)"
                placeholder="请输入"
                maxlength="19"
                :disabled="unable"
              ></el-input>
              <p v-if="is_league == true && this.flag == 0" style="color:red">
                已经是联盟定制博主，请重新输入
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称" label-width="80px">
              <el-input
                style="width:200px"
                disabled
                placeholder="自动填入"
                v-model="nickname"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" label-width="80px">
              <blogger-select
                v-model="bloggerItem.operator_id"
              ></blogger-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联盟战队" label-width="80px">
              <el-autocomplete
                style="width:200px"
                v-model.trim="inner_team_name"
                :fetch-suggestions="filterTeam"
                placeholder="联盟战队"
                @select="handleSelecttwo"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合作渠道" label-width="80px">
              <el-select
                placeholder="请选择已入驻的渠道"
                v-model="bloggerItem.source"
                @change="getSource"
                multiple
              >
                <el-option
                  v-for="(item, index) in source"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item label="定制平台价" label-width="90px">
              <span v-if="bloggerItem.source.length == 0"
                >先选择定制合作渠道</span
              >
              <el-table v-else :data="List" :show-header="false">
                <el-table-column width="70px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.source">{{
                      $getPlatformName(scope.row.source)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column width="140px">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.price"
                      disabled
                      style="width:70px"
                    ></el-input>
                    <span style="margin-left:20px">映币</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <p>渠道ID：{{ scope.row.source_id }}</p>
                    <span v-show="scope.row.price == ''" style="color:red">
                      请先维护该博主渠道平台价
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bloggerDg = false">取 消</el-button>
        <el-button type="primary" @click="bloggerSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 状态确认弹窗-->
    <el-dialog :visible.sync="statusDg" width="500px">
      <i style="color:green;font-size:18px" class="el-icon-success"></i>
      <span style="font-size:16px;margin-left:10px;">
        联盟定制博主添加成功！
      </span>
      <p
        class="top"
        style="color:#cccccc"
        v-if="this.has_yun_contract == false"
      >
        是否继续为该博主添加云账户特权？
      </p>
      <p class="top" style="color:#cccccc" v-else>该博主已经拥有云账户特权！</p>
      <span slot="footer" class="dialog-footer">
        <div v-if="this.has_yun_contract == false">
          <el-button @click="statusDg = false">不 添 加</el-button>
          <el-button type="primary" @click="goCreateCloud">去 添 加</el-button>
        </div>
        <div v-else>
          <el-button @click="statusDg = false">关 闭</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 添加云账户弹窗 -->
    <el-dialog title="云账户授权" :visible.sync="cloudDg" width="800px">
      <el-form
        width="90px"
        label-position="left"
        :rules="rules"
        ref="currItemForm"
        :model="currItem"
      >
        <p style="font-size:16px;margin-bottom:15px"><b>基本信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="映兔ID：" label-width="100px" prop="cp_id">
              <span>{{ info.cp_id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="映兔昵称：" label-width="90px">
              <span>{{ info.nickname }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="负责人："
              label-width="90px"
              prop="operator_id"
            >
              <p>
                {{ allAdmin[info.operator_id] }}
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <p style="font-size:16px;margin-bottom:15px"><b>云账户信息</b></p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="地区：" label-width="90px">
              <el-radio-group v-model="currItem.region">
                <el-radio :label="0">中国大陆</el-radio>
                <el-radio :label="1">港澳台/海外</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款方式：" label-width="90px">
              <el-radio-group v-model="currItem.payment_method">
                <el-radio :label="1">银行卡</el-radio>
                <el-radio :label="2">支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="收款户名："
              label-width="100px"
              prop="payee_name"
            >
              <el-input
                style="width:200px"
                v-model="currItem.payee_name"
                placeholder="收款人真实姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="收款账号："
              label-width="100px"
              prop="payee_account"
            >
              <el-input
                style="width:200px"
                v-model="currItem.payee_account"
                placeholder="收款人银行卡账号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="身份证号："
              label-width="100px"
              prop="payee_id"
            >
              <el-input
                style="width:200px"
                v-model="currItem.payee_id"
                placeholder="收款人身份证号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="签约手机："
              label-width="100px"
              prop="sign_phone_number"
            >
              <el-input
                style="width:200px"
                v-model="currItem.sign_phone_number"
                placeholder="请输入，用于接收云账户签约短信"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cloudDg = false">取 消</el-button>
        <el-button type="primary" @click="addCloudConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关闭权限dg -->
    <el-dialog :visible.sync="closeDg" width="300px">
      <span>确定关闭该博主定制权限？</span>
      <p>
        关闭定制权限后不影响其云账户状态！
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDg = false">取 消</el-button>
        <el-button type="primary" @click="closeBtnClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 通过Dg -->
  </div>
</template>
<script>
import BloggerSelect from "../../components/BloggerSelect";
import { goPlatformUrl } from "../../utils/platform";
import BloggerSearch from "../team/components/bloggerSearch";
import TeamSearch from "../team/components/teamSearch";
export default {
  components: {
    BloggerSelect,
    BloggerSearch,
    TeamSearch
  },
  data() {
    return {
      goPlatformUrl: goPlatformUrl,
      bloggerDg: false, //添加博主弹窗
      statusDg: false, //提交状态弹窗
      cloudDg: false, //提交云账户弹窗
      disabled1: false,
      disabled2: false,
      reopen: false,
      closeDg: false,
      unable: false, //编辑不能点击
      status: "",
      list: [],
      List: [], //合作渠道平台价展示的list
      f_cp_id: "",
      s_nickname: "", //搜索的nickname
      flag: "",
      has_yun_contract: "", //是否已有云账户
      nickname: "", //映兔昵称
      teamList: [], //搜索到的战队列表
      team_name: "",
      inner_team_name: "",
      cp_id: "",
      total: 0, //总页数
      search: {
        cp_id: "",
        nickname: "",
        operator_id: "",
        source: [],
        team_name: "",
        status: "",
        page_id: 1,
        page_size: 10
      },
      bloggerItem: {
        cp_id: "",
        operator_id: "",
        team_id: "",
        source: []
      },
      currItem: {
        sign_phone_number: "",
        region: 0,
        payment_method: 1,
        payee_name: "",
        payee_account: "",
        payee_id: ""
      },
      is_league: "", //是否已经为联盟定制博主
      info: {},
      checkList: [], //获取平台价相关信息
      source: [
        {
          id: "2",
          name: "小红书"
        },
        {
          id: "4",
          name: "B站"
        },
        {
          id: "7",
          name: "抖音"
        },
        {
          id: "1",
          name: "微博"
        },
        {
          id: "8",
          name: "快手"
        },
        {
          id: "5",
          name: "微淘"
        }
      ], //获取供选的渠道
      rules: {
        payee_name: [
          {
            required: true,
            message: "请输入收款户名",
            trigger: "blur"
          }
        ],
        payee_account: [
          {
            required: true,
            message: "请输入收款账号",
            trigger: "blur"
          }
        ],
        payee_id: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: "blur"
          }
        ],
        sign_phone_number: [
          {
            required: true,
            message: "请输入签约手机号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    allAdmin() {
      return this.$store.getters.getAllAdmin;
    },
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  watch: {
    inner_team_name(val) {
      if (val == "") {
        this.currItem.team_id = "";
      }
    },
    f_cp_id() {
      if (this.f_cp_id !== "") {
        this.disabled2 = true;
        this.search.cp_id = this.f_cp_id;
      } else {
        this.disabled2 = false;
        this.search.cp_id = "";
        this.searchBtnClick();
      }
    },
    s_nickname(val) {
      if (val !== "") {
        this.disabled1 = true;
      } else {
        this.disabled1 = false;
      }
    },
    "bloggerItem.cp_id"(val) {
      if (val == "") {
        this.is_league = "";
        this.nickname = "";
        this.checkList = [];
        this.source = [];
        this.bloggerItem.source = [];
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    changeState(value) {
      this.s_nickname = value;
    },
    handleSelectone(item) {
      this.search.team_id = item;
      this.searchBtnClick();
    },
    handleSelecttwo(item) {
      this.bloggerItem.team_id = item.team_id;
    },
    handleSelectthree(item) {
      this.search.cp_id = item;
      this.searchBtnClick();
    },
    //筛选战队
    async filterTeam(queryString, cb) {
      if (queryString === "") {
        cb([]);
        return false;
      }
      let req = {
        team_name: queryString
      };
      let res = await this.$api.getTeamName(req);
      if (res.error_code == 0) {
        this.teamList = res.data.list || [];
        for (let i = 0; i < this.teamList.length; i++) {
          this.teamList[i].value = this.teamList[i].team_name;
        }
      } else {
        this.teamList = [];
      }
      cb(this.teamList);
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    //获取联盟博主列表
    async queryList() {
      let res = await this.$api.getCustomBloggerList(
        this.$initReq(this.search)
      );
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count;
      }
    },
    //重置
    reset() {
      this.team_name = "";
      this.f_cp_id = "";
      this.s_nickname = "";
      this.search = {
        cp_id: "",
        nickname: "",
        operator_id: "",
        source: "",
        team_name: "",
        status: "",
        page_size: 10,
        page_id: 1
      };
      this.queryList();
    },
    //关闭权限
    async authorityClose(cp_id) {
      this.cp_id = cp_id;
      this.closeDg = true;
    },
    //确认关闭权限
    async closeBtnClick() {
      let res = await this.$api.closeCustomAuthority({ cp_id: this.cp_id });
      if (res.error_code == 0) {
        this.$message.success("权限关闭成功！");
        this.closeDg = false;
        this.queryList();
      } else {
        this.$message.error("权限关闭失败!");
      }
    },
    //添加/编辑/重新开启权限联盟博主
    async updateBlogger(flag, item) {
      this.reopen = false;
      this.nickname = "";
      this.inner_team_name = "";
      this.source = []; //防止点击另一个详情数据没有被清空
      this.checkList = []; //防止点击另一个详情数据没有被清空
      this.unable = false;
      this.flag = flag;
      if (flag !== 0) {
        this.status = item.status;
      }
      if (flag == 0) {
        this.bloggerItem = {
          cp_id: "",
          operator_id: "",
          team_id: "",
          team_name: "",
          source: []
        };
      } else if (flag == 1) {
        if (this.status == 2) {
          this.reopen = true;
        } else {
          this.reopen = false;
        }
        this.unable = true;
        this.bloggerItem.cp_id = item.cp_id;
        this.bloggerItem.source = item.source;
        await this.getPriceList(this.bloggerItem.cp_id);
        await this.getSource();
        this.bloggerItem.operator_id = item.operator_id;
        this.bloggerItem.team_id = item.team_id;
        this.bloggerItem.team_name = item.team_name;
        this.nickname = item.nickname;
        this.inner_team_name = item.team_name;
      } else {
        this.unable = true;
        this.bloggerItem = {
          cp_id: "",
          operator_id: "",
          team_id: "",
          team_name: "",
          source: []
        };
        this.bloggerItem.cp_id = item.cp_id;
        this.getPriceList(this.bloggerItem.cp_id);
        this.nickname = item.nickname;
      }
      this.bloggerDg = true;
    },
    //提交联盟博主信息
    async bloggerSubmit() {
      if (this.bloggerItem.cp_id == "") {
        this.$message.error("请输入用户ID！");
        return false;
      }
      if (this.is_league == true) {
        this.$message.error("用户已存在，请重新输入！");
        return false;
      }
      if (this.bloggerItem.operator_id == "") {
        this.$message.error("请选择负责人！");
        return false;
      }
      if (this.bloggerItem.team_id == "") {
        this.$message.error("请选择联盟战队！");
        return false;
      }
      if (this.bloggerItem.source.length == 0) {
        this.$message.error("请选择合作渠道");
        return false;
      }
      for (let i = 0; i < this.List.length; i++) {
        if (this.List[i].price == "") {
          this.$message.error(
            "请先维护" + this.$getPlatformName(this.List[i].source) + "的平台价"
          );
          return false;
        }
      }
      let req = {
        cp_id: this.bloggerItem.cp_id,
        operator_id: this.bloggerItem.operator_id,
        team_id: this.bloggerItem.team_id,
        sources: this.bloggerItem.source
      };
      if (this.flag == 0) {
        this.has_yun_contract = false;
        let res = await this.$api.addCustomBlogger(req);
        if (res.error_code == 0) {
          this.bloggerDg = false;
          this.has_yun_contract = res.data.has_yun_contract;
          this.info = {
            cp_id: res.data.cp_id,
            nickname: res.data.nickname,
            operator_id: res.data.operator_id
          };
          this.statusDg = true;
        }
      } else if (this.flag == 1) {
        if (this.status == 1) {
          req.reopen_authority = false;
          let res = await this.$api.updateCustomBlogger(req);
          if (res.error_code == 0) {
            this.$message.success("修改成功");
            this.bloggerDg = false;
            this.queryList();
          }
          this.bloggerDg = false;
        } else {
          this.bloggerDg = false;
        }
      } else {
        req.reopen_authority = true;
        let res = await this.$api.updateCustomBlogger(req);
        if (res.error_code == 0) {
          this.$message.success("重启成功");
          this.bloggerDg = false;
          this.queryList();
        }
        this.bloggerDg = false;
      }
    },
    //去添加云账户
    goCreateCloud() {
      this.cloudDg = true;
    },
    //确认为博主添加云账户
    addCloudConfirm() {
      this.$refs["currItemForm"].validate(async vaild => {
        if (vaild) {
          let req = Object.assign(this.info, this.currItem);
          let res = await this.$api.addSignedBlogger(req);
          if (res.error_code == 0) {
            this.$message.success("添加成功！");
            this.cloudDg = false;
            this.statusDg = false;
            this.queryList();
          }
        } else {
          return false;
        }
      });
    },
    async getMessage(cp_id) {
      if (this.bloggerItem.cp_id !== "") {
        await this.getPriceList(cp_id);
        await this.getBloggerName();
        await this.getYunMessage();
      }
    },
    //查看云账户的状态
    async getYunMessage() {
      let req = {
        cp_id: this.bloggerItem.cp_id || "0"
      };
      let res = await this.$api.getBloggerYunMessage(req);
      if (res.error_code == 0) {
        if (res.data) {
          if (res.data.operator_id !== "0") {
            this.bloggerItem.operator_id = res.data.operator_id;
          } else {
            this.bloggerItem.operator_id = "";
          }
        }
      }
    },
    //自动根据id键入映兔名搜索
    async getBloggerName() {
      if (this.bloggerItem.cp_id == "") {
        return false;
      }
      let req = {
        cp_id: this.bloggerItem.cp_id || "0"
      };
      let res = await this.$api.getBloggerMessage(req);
      if (res.error_code == 0) {
        if (res.data) {
          this.nickname = res.data.nickname;
          this.is_league = res.data.is_league;
        }
      }
    },
    //获取平台价等信息
    async getPriceList(cp_id) {
      let res = await this.$api.getPriceList({ cp_id: cp_id });
      if (res.error_code == 0) {
        let list = res.data.source_list || [];
        let array = [];
        if (list.length !== 0) {
          list.map(item => {
            array.push(
              Object.assign(
                {},
                { id: item },
                { name: this.$getPlatformName(item) }
              )
            );
          });
        }
        this.source = array; //下拉备选列表，用户已经入驻的渠道
        let c_list = res.data.price_list || [];
        c_list.map(item => {
          return (item.price = item.price / 100);
        });
        this.checkList = c_list; //已经入驻的渠道的平台价的具体信息
      }
    },
    getSource() {
      let _list = this.bloggerItem.source.map(source => {
        let obj = this.checkList.find(item => {
          return item.source == source;
        });
        if (obj) {
          return obj;
        } else {
          return {};
        }
      });
      this.List = _list || [];
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryList();
    }
  }
};
</script>
<style scoped>
.top {
  margin-top: 10px;
  margin-left: 33px;
}
</style>
