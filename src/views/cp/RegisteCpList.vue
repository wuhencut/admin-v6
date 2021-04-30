<template>
  <div class="page">
    <el-form inline>
      <el-form-item>
        <el-input
          v-model.trim="search.cp_id"
          placeholder="映兔账号id"
          class="search-inp"
          @keyup.enter.native="searchBtnClick"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="search.cp_nickname"
          placeholder="用户昵称"
          class="search-inp"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.source"
          @change="searchBtnClick"
          placeholder="请选择渠道"
        >
          <el-option label="全部渠道" value></el-option>
          <el-option
            v-for="item in $platformList"
            :label="item.name"
            :value="item.id + ''"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="search.source_id"
          placeholder="渠道ID"
          class="search-inp"
          @keyup.enter.native="searchBtnClick"
        ></el-input>
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
      <el-table-column
        label="映兔ID"
        prop="user_id"
        min-width="120"
      ></el-table-column>
      <el-table-column label="用户昵称" prop="nickname"></el-table-column>
      <el-table-column label="绑定手机号" prop="bind_phone"></el-table-column>
      <el-table-column label="绑定渠道/粉丝数" prop="register_time">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.channel" :key="index">
            {{ $getPlatformName(item.source) }} /
            {{ item.fans || "-" }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="register_time">
        <template slot-scope="scope">
          {{
            moment(scope.row.register_time * 1000).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">已入驻</el-tag>
          <el-tag v-else type="danger">未入驻</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="channelDetail(scope.row.user_id)"
            >渠道信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
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
    <!--分页 end-->

    <!-- 渠道列表弹窗 -->
    <el-dialog :visible.sync="channelDg" title="渠道信息" width="1000px">
      <el-table :data="channelList"
        >queryChannelList
        <el-table-column label="已绑定渠道" prop="source">
          <template slot-scope="scope">
            <el-link
              style="margin-right: 10px;"
              type="primary"
              @click="goPlatformUrl(scope.row.homepage_url)"
              >{{ $getPlatformName(scope.row.source) }}主页</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="渠道ID" prop="source_id"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 1">已入驻</el-tag>
            <el-tag v-else type="danger">未入驻</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="绑定时间" width="150" prop="bind_time">
          <template slot-scope="scope">
            {{
              moment(scope.row.bind_time * 1000).format("YYYY-MM-DD HH:mm:ss")
            }}
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname">
          <template slot-scope="scope">
            {{ scope.row.nickname || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="粉丝量" prop="fans">
          <template slot-scope="scope">
            {{ scope.row.fans || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="凭证" prop="homepage_image">
          <template slot-scope="scope">
            <img
              v-if="scope.row.homepage_image"
              @click="homepageClick(scope.row.homepage_image)"
              width="50px"
              :src="scope.row.homepage_image"
              alt=""
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="authList.indexOf('id89') > -1"
              type="text"
              @click="forceUnbind(scope.row.source)"
              >强行解绑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 主页截图 -->
    <el-dialog title="主页截图" width="500px" :visible.sync="showHomepage">
      <img width="100%" :src="homepage" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import { goPlatformUrl, getPlatformName } from "../../utils/platform";
export default {
  name: "RegisteCpList",
  data() {
    return {
      goPlatformUrl: goPlatformUrl,
      getPlatformName: getPlatformName,
      currUserId: "", // 当前用户id
      moment: moment,
      homepage: "", // 主页截图
      showHomepage: false,
      channelDg: false, // 渠道列表弹窗
      search: {
        page_id: 1,
        page_size: 10,
        cp_nickname: "",
        source: "",
        source_id: "",
        cp_id: ""
      },
      total: 0, // count
      channelList: [], // 用户渠道绑定列表
      list: []
    };
  },
  computed: {
    authList() {
      return this.$store.getters.getAuthList;
    }
  },
  created() {
    this.queryList();
  },
  methods: {
    async queryList() {
      let res = await this.$api.registeCpSearch(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data.list || [];
        this.total = res.data.count || 0;
      }
    },
    refreshBtnClick() {
      this.search = {
        page_id: 1,
        page_size: 10,
        cp_nickname: "",
        cp_id: "",
        status: "",
        source: "",
        source_id: ""
      };
      this.queryList();
    },
    searchBtnClick() {
      this.search.page_id = 1;
      this.queryList();
    },
    async channelDetail(cp_id) {
      this.currUserId = cp_id;
      this.queryChannelList(cp_id);
    },
    async queryChannelList(cp_id) {
      this.channelDg = true;
      let res = await this.$api.getCpBindedChannelList({ cp_id });
      if (res.error_code == 0) {
        this.channelList = res.data.list || [];
        this.channelDg = true;
      }
    },
    handleCurrentChange(num) {
      this.search.page_id = num;
      this.queryList();
    },
    async forceUnbind(source) {
      this.$confirm(
        "强行解绑后系统不会通知用户，用户不能再绑定此账号。非极端情况，请联系用户自行解绑",
        "确认解绑",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        this.queryChannelList(this.currUserId);
        let res = await this.$api.forceUnbindChannel({
          cp_id: this.currUserId,
          source_id: source
        });
        if (res.error_code == 0) {
          this.$message.info("解绑成功");
          this.queryChannelList(this.currUserId);
        }
      });
    },
    // 展示主页截图
    homepageClick(img) {
      this.showHomepage = true;
      this.homepage = img;
    }
  }
};
</script>
