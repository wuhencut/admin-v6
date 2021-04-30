<template>
  <div class="page-reward">
    <el-form inline>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.campaign_id"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动Id"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.campaign_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="活动名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          class="search-inp"
          v-model.trim="search.brand_name"
          @keyup.enter.native="searchBtnClick"
          placeholder="品牌名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          class="search-inp"
          v-model="search.reward_is_offered"
          @change="searchBtnClick"
        >
          <el-option label="全部状态" :value="-1"></el-option>
          <el-option label="待审核" :value="0"></el-option>
          <el-option label="已完成" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <admin-select
          class="search-inp"
          @change="searchBtnClick"
          v-model="search.admin_id"
          isAll
        ></admin-select>
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="活动Id"
        prop="campaign_id"
        width="100"
      ></el-table-column>
      <el-table-column
        label="活动名称"
        prop="campaign_name"
        min-width="200"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        prop="production_name"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="品牌名"
        prop="brand_name"
        width="200"
      ></el-table-column>
      <el-table-column
        label="所属公司"
        prop="company_name"
        width="200"
      ></el-table-column>
      <el-table-column label="赏金名额" width="100">
        <template slot-scope="scope">
          <div>
            <p v-if="scope.row.reward.type == 1">
              {{ scope.row.reward.form.quotas }}
            </p>
            <p v-if="scope.row.reward.type == 2 || scope.row.reward.type == 0">
              -
            </p>
            <p v-if="scope.row.reward.type == 3">
              {{ scope.row.reward.emv.quotas }}
            </p>
            <p v-if="scope.row.reward.type == 4">
              {{ scope.row.reward.idea.quotas }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="110">
        <template slot-scope="scope">
          <div>{{ admin_list[scope.row.admin_id] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <div>
            <p v-if="scope.row.reward_is_offered == 0">待审核</p>
            <p v-if="scope.row.reward_is_offered == 1">已完成</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button @click="detailBtnClick(scope.row)" type="text"
              >查看详情</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- /table -->
    <!--page-->
    <div class="pagination" v-if="count > 0">
      <el-pagination
        background
        layout="total,prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="search.page_id"
        :page-size="10"
        :total="count"
      >
      </el-pagination>
    </div>
    <!--/page-->
  </div>
</template>
<script>
import AdminSelect from "../../components/AdminSelect";

export default {
  components: {
    AdminSelect
  },
  data() {
    return {
      search: {
        campaign_id: this.$route.query.campaign_id || "",
        campaign_name: this.$route.query.campaign_name || "",
        brand_name: this.$route.query.brand_name || "",
        reward_is_offered: parseInt(this.$route.query.reward_is_offered || 0),
        page_id: parseInt(this.$route.query.page_id || 1),
        page_size: 10,
        admin_id: "0" //负责人id
      },
      list: [],
      count: 0
    };
  },
  mounted() {
    this.getList();
  },
  computed: {
    admin_list() {
      return this.$store.state.allAdmin;
    }
  },
  methods: {
    searchBtnClick() {
      this.search.page_id = 1;
      this.getList();
    },
    //获取列表
    async getList() {
      if (
        !/\d+/.test(this.search.campaign_id) &&
        this.search.campaign_id != ""
      ) {
        this.$message.error("活动ID为数字");
        return;
      }
      let req = this.$initReq(this.search);
      let res = await this.$api.campaignRewardList(req);
      if (res.error_code == 0) {
        this.list = res.data.list;
        this.count = res.data.count;
        this.replaceUrl();
      } else {
        this.list = [];
      }
    },
    //切换页码
    currentChange(val) {
      this.search.page_id = val;
      this.getList();
    },
    //切换url
    replaceUrl() {
      this.$router.replace({
        name: "activityReward",
        query: this.search
      });
    },
    detailBtnClick(item) {
      let text = "";
      let quotas = 0;
      let is_unique = ["合集", "非合集"];
      let form2 = ["不限形式", "仅视频", "仅图片"];
      let channel = [
        "不限渠道",
        "微博",
        "小红书",
        "美拍",
        "B站",
        "微淘",
        "公众号",
        "抖音",
        "快手"
      ];
      //普通活动
      if (item.reward.type == 0) {
        let form = item.reward.form;
        let bounty = form.bounty / 100;
        let requirements = "推广要求，"; //推广要求会在下个版本做一个弹窗们现在只用这四个字代替
        if (!form.extension_status) {
          requirements = "";
        }
        quotas = form.quotas;
        text =
          "悬赏信息：" +
          is_unique[form.is_unique] +
          "，" +
          form2[form.form] +
          "，" +
          channel[form.channel] +
          "，" +
          requirements +
          bounty +
          "映币/人，" +
          quotas +
          "人";
      }
      //测评形式
      if (item.reward.type == 1) {
        let form = item.reward.form;
        let bounty = form.bounty / 100;
        let requirements = "推广要求，"; //推广要求会在下个版本做一个弹窗们现在只用这四个字代替
        let nrequire = "附加要求： "; // 附加要求
        let channelTxt = ""; //渠道限制
        let accountTxt = "账号话题："; // 账号话题
        if (!form.extension_status) {
          requirements = "";
        }
        if (
          form.keywords ||
          form.picture_count ||
          form.word_count ||
          form.publish_time
        ) {
          if (form.keywords) {
            let keywords = "";
            for (let i = 0; i < form.keywords.length; i++) {
              keywords += form.keywords[i] + "， ";
            }
            nrequire += "关键词：" + keywords;
          }
          if (form.picture_count) {
            nrequire += "图片数" + form.picture_count + "张， ";
          }
          if (form.word_count) {
            nrequire += "字数" + form.word_count + "个， ";
          }
          if (form.publish_time) {
            nrequire += "发布日期" + form.publish_time + "，";
          }
        } else {
          nrequire = "";
        }
        // 渠道列表
        if (form.channels) {
          for (let i = 0; i < form.channels.length; i++) {
            channelTxt += channel[form.channels[i]] + "，";
          }
        } else {
          channelTxt = "不限渠道";
        }
        // 账号话题
        if (form.extension_channel) {
          for (let i = 0; i < form.extension_channel.length; i++) {
            accountTxt +=
              "@" +
              form.extension_channel[i].account +
              "#" +
              form.extension_channel[i].topic +
              " 渠道: " +
              channel[form.extension_channel[i].channel] +
              "， ";
          }
        } else {
          accountTxt = "";
        }
        let preferential = form.extension_preferential
          ? "优惠信息：" + form.extension_preferential
          : "";
        quotas = form.quotas;
        text =
          "悬赏信息：" +
          is_unique[form.is_unique] +
          "，" +
          form2[form.form] +
          "，" +
          channelTxt +
          requirements +
          bounty +
          "映币/人，" +
          quotas +
          "人， " +
          nrequire +
          accountTxt +
          preferential;
      }
      // 报价活动
      if (item.reward.type == 2) {
        let form = item.reward.rank;
        // let bounty = form.bounty / 100;
        // let first_bounty = form.bounty["1"] / 100,
        //   second_bounty = form.bounty["2"] / 100,
        //   third_bounty = form.bounty["3"] / 100;
        // let requirements = "推广要求，"; //推广要求会在下个版本做一个弹窗们现在只用这四个字代替
        // if (!form.extension_status) {
        //   requirements = "";
        // }
        quotas = form.quotas;
        text =
          "悬赏信息：" +
          is_unique[form.is_unique] +
          "，" +
          form2[form.form] +
          "，" +
          channel[form.channel] +
          "，" +
          quotas +
          "人";
      }
      //emv
      if (item.reward.type == 3) {
        let form = item.reward.emv;
        let bounty = form.bounty / 100;
        quotas = form.quotas;
        text =
          "悬赏信息：EMV门槛" +
          form.emv_threshold +
          "," +
          bounty +
          "映币/人," +
          quotas +
          "人";
      }

      if (item.reward.type == 4) {
        let form = item.reward.idea; // 创意悬赏
        // let bounty = form.bounty / 100; // 赏金
        quotas = form.quotas;
        text =
          "悬赏信息: 创意悬赏" +
          is_unique[form.is_unique] +
          ", " +
          form2[form.form] +
          ", " +
          channel[form.channel];
      }

      this.$router.push({
        name: "orderReward",
        query: {
          id: item.campaign_id,
          text: text,
          type: item.reward.type,
          is_offered: item.reward_is_offered,
          quotas: quotas
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.page-reward {
  .pagination {
    padding: 30px 0;
    text-align: center;
  }
}
</style>
