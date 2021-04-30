<template>
  <div class="cp-list">
    <!--form-->
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.cp_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="映兔账户Id"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.cp_nickname"
          @keyup.enter.native="searchBtnClick"
          placeholder="用户昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.status"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="全部状态"></el-option>
          <el-option :value="0" label="正常"></el-option>
          <el-option :value="1" label="冻结"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.category_id"
          @change="searchBtnClick"
        >
          <el-option value="0" label="全部类目"></el-option>
          <el-option
            v-for="(item, index) in allCategories"
            :key="index"
            :value="item.category_id"
            :label="item.category_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.source"
          @change="searchBtnClick"
        >
          <el-option value label="全部渠道"></el-option>
          <el-option
            v-for="(channel, index) in channelList"
            :key="index"
            :label="channel.name"
            :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.emv_sort"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="不限渠道EMV"></el-option>
          <el-option :value="0" label="从高到低"></el-option>
          <el-option :value="1" label="自定义"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="search.emv_sort == 1">
        <el-input
          v-model="search.emv_start"
          type="text"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
        -
        <el-input
          style="width:100px"
          v-model="search.emv_end"
          type="text"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.fan_sort"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="渠道粉丝数"></el-option>
          <el-option :value="0" label="从高到低"></el-option>
          <el-option :value="1" label="自定义"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="search.fan_sort == 1">
        <el-input
          style="width:100px"
          v-model="search.fan_start"
          type="text"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
        -
        <el-input
          style="width:100px"
          v-model="search.fan_end"
          type="text"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="search.type"
          style="width:100px"
          @change="searchBtnClick"
        >
          <el-option label="不限博主类型" value="全部"></el-option>
          <el-option value="KA"></el-option>
          <el-option value="A"></el-option>
          <el-option value="B"></el-option>
          <el-option value="C"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="search.level"
          class="search-inp"
          @change="searchBtnClick"
        >
          <el-option :value="-1" label="不限博主等级"></el-option>
          <el-option :value="1"></el-option>
          <el-option :value="2"></el-option>
          <el-option :value="3"></el-option>
          <el-option :value="4"></el-option>
          <el-option :value="5"></el-option>
          <el-option :value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.credit"
          @change="searchBtnClick"
        >
          <el-option label="不限博主信用" value="全部"></el-option>
          <el-option value="优质"></el-option>
          <el-option value="良好"></el-option>
          <el-option value="风险"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          @change="searchBtnClick"
          class="search-inp"
          v-model="search.ensure_status"
        >
          <el-option label="不限保障状态" value></el-option>
          <el-option value="未加入"></el-option>
          <el-option value="已退出"></el-option>
          <el-option value="保障中"></el-option>
          <el-option value="已限制"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchBtnClick"
          >查询</el-button
        >
        <el-button @click="refreshBtnClick" icon="el-icon-refresh"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!--/form-->
    <!--table-->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="入驻时间" width="150">
        <template slot-scope="scope">
          <p>{{ moment(scope.row.enter_time * 1000).format("YYYY-MM-DD") }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="用户昵称"
        prop="cp_nickname"
        min-width="150"
      ></el-table-column>
      <el-table-column label="类型-等级|信用-信用分" width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.type }}-{{ scope.row.level }}</div>
          <div>{{ scope.row.credit }} - {{ scope.row.credit_point }}</div>
        </template>
      </el-table-column>
      <el-table-column label="授权渠道/EMV/粉丝数" min-width="200">
        <template slot-scope="scope">
          <div :key="index" v-for="(item, index) in scope.row.channel">
            {{ channelList[item.source - 1].name }}/{{ item.emv }}/{{
              item.fans
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类目" min-width="150">
        <template v-if="scope.row.categories" slot-scope="scope">
          <span v-for="(item, index) in scope.row.categories" :key="index">
            {{ item.category_name }}
            <span v-if="index < scope.row.categories.length - 1">、</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="保障状态" prop="ensure_status"></el-table-column>
      <el-table-column label="当前状态" width="100">
        <template slot-scope="scope">
          <p>
            <span v-if="scope.row.status == 0">正常</span>
            <span v-if="scope.row.status == 1">冻结</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <p>
            <el-button @click="showBtnClick(scope.row)" type="text"
              >查看详情</el-button
            >
            <template v-if="authList.indexOf('id87') > -1">
              <el-button
                @click="frozenBenClick(scope.row)"
                v-if="scope.row.status == 0"
                type="text"
                >冻结账户</el-button
              >
              <el-button @click="unfrozenBenClick(scope.row)" v-else type="text"
                >解冻账户</el-button
              >
            </template>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <!--/table-->
    <!--分页-->
    <div class="pagination" v-if="search.total !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="search.page_id"
        :page-size="search.page_size"
        layout="total, prev, pager, next, jumper"
        :total="search.total"
      ></el-pagination>
    </div>
    <!--分页 end-->
    <el-dialog title="博主详情" :visible.sync="cpDialog" width="900px">
      <el-form label-width="80px" label-position="left">
        <div class="info-title">设置</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="责任人">
              <!--value-key  指的是用来对比的value的key，因为对象无法进行比对-->
              <el-select
                v-model="cpInfo.admin"
                value-key="email"
                style="width:100%"
              >
                <el-option
                  v-for="item in liablerList"
                  :label="item.name"
                  :value="item"
                  :key="item.email"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主渠道">
              <el-select v-model="cpInfo.main_source" style="width:100%">
                <el-option
                  v-for="(item, key) in channelList"
                  :value="item.id"
                  :label="item.name"
                  :key="key"
                  :disabled="
                    cpInfo.source ? cpInfo.source.indexOf(item.id) < 0 : true
                  "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="博主类目">
              <el-select
                style="width:100%"
                v-model="cpInfo.categories"
                value-key="category_id"
                multiple
              >
                <el-option
                  v-for="item in allCategories"
                  :key="item.category_id"
                  :value="item"
                  :label="item.category_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="评价标签">
              <el-select
                v-model="cpInfo.cp_tag"
                multiple
                :multiple-limit="3"
                value-key="tag_id"
                style="width:100%"
              >
                <el-option
                  v-for="item in emergeTagList"
                  :value="item"
                  :label="item.tag_name"
                  :key="item.tag_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="info-title">个人信息</div>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="博主类型">
              <el-input disabled v-model="cpInfo.type"></el-input>
            </el-form-item>
            <el-form-item label="账户ID">
              <el-input disabled v-model="cpInfo.cp_id"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-input disabled v-model="cpInfo.real_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="博主等级">
              <el-input disabled v-model="cpInfo.level"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称">
              <el-input disabled v-model="cpInfo.cp_nickname"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <div style="display: flex">
                <el-input
                  class="inp-add"
                  v-model="areaCode"
                  style="width: 80px;"
                ></el-input>
                <el-input v-model="cpInfo.phone"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="信用等级">
              <el-input disabled v-model="cpInfo.credit"></el-input>
            </el-form-item>
            <el-form-item label="入驻时间">
              <p>
                {{ moment(cpInfo.enter_time * 1000).format("YYYY年MM月DD日") }}
              </p>
            </el-form-item>
            <el-form-item label="微信号">
              <el-input disabled v-model="cpInfo.wx"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="info-title">渠道信息</div>
        <el-table :data="cpInfo.channel">
          <el-table-column prop="source" label="入驻渠道" width="150">
            <template slot-scope="scope">
              <p>
                {{ channelList[scope.row.source - 1].name }}
                <span
                  v-if="cpInfo.wx_bind_status && scope.row.source == 6"
                  style="color: green"
                  >(已授权)</span
                >
                <span
                  v-if="!cpInfo.wx_bind_status && scope.row.source == 6"
                  style="color: red"
                  >(未授权)</span
                >
              </p>
            </template>
          </el-table-column>
          <el-table-column label="昵称" prop="cp_nickname"></el-table-column>
          <el-table-column prop="fans" label="粉丝数" width="120">
            <template slot-scope="scope">
              <p v-if="scope.row.fans">{{ scope.row.fans }}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column prop="emv" label="预估EMV" width="120">
            <template slot-scope="scope">
              <p v-if="scope.row.emv">{{ scope.row.emv }}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column prop="link" label="链接">
            <template slot-scope="scope">
              <el-link type="primary" @click="goPlatformUrl(scope.row.link)">{{
                $getPlatformName(scope.row.source)
              }}</el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="closeSource(scope.row)"
                >关闭</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </el-form>

      <div v-if="cpInfo.ensure_info.ensure_status">
        <div class="info-title">保障信息</div>
        <table class="in-table">
          <tbody>
            <tr>
              <td>授权时间</td>
              <td>
                {{
                  moment(cpInfo.ensure_info.start_time * 1000).format(
                    "YYYY/MM/DD HH:mm:ss"
                  )
                }}
              </td>
              <td>到期时间</td>
              <td>
                {{
                  moment(cpInfo.ensure_info.expire_time * 1000).format(
                    "YYYY/MM/DD HH:mm:ss"
                  )
                }}
              </td>
              <td>押金金额</td>
              <td>{{ cpInfo.ensure_info.ensure_money }}</td>
              <td>保障状态</td>
              <td>{{ cpInfo.ensure_info.ensure_status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer" v-if="authList.indexOf('id88') > -1">
        <el-button @click="saveBtnClick" type="primary">保存</el-button>
        <el-button @click="cpDialog = false">取消</el-button>
      </div>
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
      moment: moment,
      areaCode: "86", // 区号
      search: {
        total: 0,
        cp_id: "",
        cp_nickname: "",
        status: -1,
        page_id: 1,
        page_size: 10,
        category_id: "0", // 类目id（0:表示全部，否则为指定的类目id）
        source: "", // 授权渠道
        emv_start: null, //emv限制（小），若不限则为-1
        emv_end: null, //emv限制（大），若不限则为-1
        emv_sort: -1, //按照emv排序，（-1: 无限制，0:高->低，1:低->高）
        fan_start: null, // 粉丝数限制（小），若不限则为-1
        fan_end: null, //	粉丝数限制（大），若不限则为-1
        fan_sort: -1, // 按照粉丝排序，（-1:无限制，0:高->低，1:低->高）
        type: "全部", //博主类型
        level: -1, //博主等级
        credit: "全部", //信用等级
        ensure_status: "" // 保障状态
      },
      list: [],
      cpDialog: false,
      cpInfo: {
        ensure_info: {}
      },
      emergeTagList: [], // 浮现标签信息列表
      liablerList: [], // 责任人列表
      allCategories: [], // 所有类目
      channelList: [
        {
          // 渠道列表
          name: "微博",
          id: "1"
        },
        {
          name: "小红书",
          id: "2"
        },
        {
          name: "美拍",
          id: "3"
        },
        {
          name: "B站",
          id: "4"
        },
        {
          name: "微淘",
          id: "5"
        },
        {
          name: "微信公众号",
          id: "6"
        },
        {
          name: "抖音",
          id: "7"
        },
        {
          name: "快手",
          id: "8"
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
    this.cpSearch();
    this.getLiablerList(); //获取责任人列表
    this.getTagList();
    this.getCategories(); // 获取所有类目
  },
  methods: {
    // 重置搜索
    refreshBtnClick() {
      this.search = {
        total: 0,
        cp_id: "",
        cp_nickname: "",
        status: -1,
        page_id: 1,
        page_size: 20,
        category_id: "0", // 类目id（0:表示全部，否则为指定的类目id）
        source: "", // 授权渠道
        emv_start: null, //emv限制（小），若不限则为-1
        emv_end: null, //emv限制（大），若不限则为-1
        emv_sort: -1, //按照emv排序，（-1: 无限制，0:高->低，1:低->高）
        fan_start: null, // 粉丝数限制（小），若不限则为-1
        fan_end: null, //	粉丝数限制（大），若不限则为-1
        fan_sort: -1, // 按照粉丝排序，（-1:无限制，0:高->低，1:低->高）
        type: "全部", //博主类型
        level: -1, //博主等级
        credit: "全部", //信用等级
        ensure_status: "" // 保障状态
      };
      this.cpSearch();
    },
    // 获取所有类目
    async getCategories() {
      let res = await this.$api.getCategories();
      if (res.error_code == 0) {
        this.allCategories = res.data.category;
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
    //获取标签列表
    async getTagList() {
      //获取标签信息
      let res = await this.$api.getTagList({});
      if (res.error_code == 0) {
        this.tagList = res.data.tag;
      }
      //获取浮动标签
      let emergeRes = await this.$api.getEmergeTagList();
      if (emergeRes.error_code == 0) {
        this.emergeTagList = emergeRes.data.tag;
      }
    },
    //搜索博主
    async cpSearch() {
      let req = { ...this.search };
      req.cp_id = req.cp_id || "0";
      req.emv_start = req.emv_start - 0;
      req.emv_end = req.emv_end - 0;
      req.fan_start = req.fan_start - 0;
      req.fan_end = req.fan_end - 0;
      if (req.emv_sort != 1) {
        req.emv_start = 0;
        req.emv_end = 0;
      } else if (req.emv_start > req.emv_end) {
        this.$message.error("开始至应该小于结尾值");
        return false;
      }
      if (req.fan_sort != 1) {
        req.fan_start = 0;
        req.fan_end = 0;
      } else if (req.fan_start > req.fan_end) {
        this.$message.error("开始至应该小于结尾值");
        return false;
      }
      if (!/\d+| 0/.test(req.cp_id)) {
        this.$message.error("映兔账号ID为数字");
        return;
      }
      let res = await this.$api.cpSearch(this.$initReq(req));
      if (res.error_code == 0) {
        if (!res.data) {
          this.list = [];
          this.search.total = 0;
          return false;
        }
        this.list = res.data.list || [];
        this.search.total = res.data.total;
      } else {
        this.list = [];
      }
    },
    //点击搜索按钮  搜索条件的变化，page_id无变化
    async searchBtnClick() {
      this.search.page_id = 1;
      this.cpSearch();
    },
    //显示博主详情
    async showBtnClick(item) {
      let req = { cp_id: item.cp_id };
      let res = await this.$api.getCpDetail(req);
      if (res.error_code == 0) {
        this.cpInfo = res.data || {};
        if (!this.cpInfo.ensure_info) {
          this.cpInfo.ensure_info = {};
        }
        this.areaCode = (this.cpInfo.area_code
          ? this.cpInfo.area_code
          : "+86"
        ).slice(1);
        //处理空数组null -> []
        this.cpInfo.categories = this.cpInfo.categories || [];
        this.cpInfo.cp_tag = this.cpInfo.cp_tag || [];
        this.cpInfo.source = [];
        // 提取已经通过的渠道source 给主渠道选择用
        for (let i = 0; i < this.cpInfo.channel.length; i++) {
          this.cpInfo.source.push(this.cpInfo.channel[i].source);
        }
        this.cpDialog = true;
      } else {
        return false;
      }
    },
    //点击保存按钮
    async saveBtnClick() {
      this.cpInfo.area_code = "+" + this.areaCode;
      let res = await this.$api.cpDetailUpdate(this.cpInfo);
      if (res.error_code == 0) {
        this.$message.success("操作成功");
        this.cpSearch();
        this.cpDialog = false;
      }
    },
    prveBtnClick() {
      this.search.page_id--;
      this.cpSearch();
    },
    nextBtnClick() {
      this.search.page_id++;
      this.cpSearch();
    },
    //冻结
    frozenBenClick(item) {
      let cp = { ...item };
      cp.status = 1;
      this.updateStatus(cp);
    },
    //解冻
    unfrozenBenClick(item) {
      let cp = { ...item };
      cp.status = 0;
      this.updateStatus(cp);
    },
    //更改账户状态
    updateStatus(item) {
      let message = item.status == 1 ? "确定冻结账户吗？" : "确定解冻账户吗？";
      this.$confirm(message, "操作提示")
        .then(async () => {
          let res = await this.$api.cpModify(item);
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.cpSearch();
          }
        })
        .catch(() => {
          return false;
        });
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.cpSearch();
    },
    //关闭渠道
    closeSource(source) {
      if (
        source.source == this.cpInfo.main_source &&
        this.cpInfo.source.length > 1
      ) {
        this.$message.error("宝贝儿， 别把主渠道关闭了呀！");
        return false;
      }
      this.$confirm("冻结后，博主需重新提交入驻审核", "是否确认冻结该渠道")
        .then(async () => {
          /**
           * 关闭渠道调用修改信息接口
           * 只多添加一个字段unbind_source 解绑渠道
           */
          let req = { ...this.cpInfo };
          req.unbind_source = source.source;
          let res = await this.$api.cpDetailUpdate(this.$initReq(req));
          if (res.error_code == 0) {
            this.$message.success("操作成功");
            this.cpDialog = false;
            this.cpSearch();
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
.cp-list {
  .pagination {
    text-align: center;
    margin: 10px 0;
  }
  .tag + .tag {
    margin-left: 10px;
  }
}

.search-num-inp {
  outline: none;
  width: 80px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 12px;
}

.info-title {
  color: #aeaeae;
  font-size: 16px;
  padding-left: 0px;
  line-height: 50px;
  text-align: left;
  border-top: 1px solid #e6e6e6;
}

.line {
  height: 30px;
  border-top: 1px solid #ececec;
}

.link {
  line-height: 40px;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
}

.inp-add::after {
  content: "+";
  color: #000;
  width: 10px;
  height: 10px;
  position: absolute;
  left: 4px;
  top: -1px;
  display: block;
}
</style>
