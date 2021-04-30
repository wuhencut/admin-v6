<template>
  <div class="page-order-reward">
    <!-- form -->
    <el-form inline>
      <el-form-item>
        <p>
          <el-button @click="$router.back()" icon="el-icon-arrow-left"
            >返回</el-button
          >
        </p>
      </el-form-item>
      <el-form-item v-if="type != 2 && type != 0">
        <p>{{ text }}</p>
      </el-form-item>
    </el-form>
    <!-- /form -->
    <el-table :data="list">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        width="150"
        label="博主ID"
        prop="cp_user_id"
      ></el-table-column>
      <el-table-column
        width="150"
        label="博主昵称"
        prop="nickname"
      ></el-table-column>
      <el-table-column width="180" label="测评时间">
        <template slot-scope="scope">
          <div>
            {{
              moment(scope.row.appraisal_time * 1000).format("YYYY-MM-DD HH:mm")
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="测评链接" width="200">
        <template slot-scope="scope">
          <div
            :key="index"
            v-for="(href, index) in scope.row.apprasial_urls"
            style="white-space: nowrap"
          >
            <a :href="href" target="_blank">{{ href }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" label="赏金">
        <template slot-scope="scope"
          >{{ scope.row.is_offer ? "报价" : ""
          }}{{ scope.row.point }}映币</template
        >
      </el-table-column>
      <el-table-column min-width="300" label="报价信息">
        <template slot-scope="scope">
          <!-- v-if="scope.row.offer_cond" -->
          <div v-if="scope.row.is_offer == 1">
            <span>{{ unique[scope.row.offer_cond.unique] }}、</span>
            <span>{{ reviewsType[scope.row.offer_cond.form] }}、</span>
            <span>{{ $getPlatformName(scope.row.offer_cond.channel) }}、</span>
            <span>要求</span>
            <el-popover width="300" placement="bottom" trigger="click">
              <div>{{ scope.row.offer_cond.idea }}</div>
              <br />
              <div
                :key="index"
                v-for="(item, index) in scope.row.offer_cond.extension_channel"
              >
                {{
                  scope.row.offer_cond.channel_status == true ? "带" : "不带"
                }}
                @ {{ item.account }}, #{{ item.topic }}
              </div>
              <br />
              <div v-if="scope.row.offer_cond.extension_preferential">
                {{
                  scope.row.offer_cond.preferential_status == true
                    ? "带"
                    : "不带"
                }}优惠信息：{{ scope.row.offer_cond.extension_preferential }}
              </div>
              <div>
                {{
                  scope.row.offer_cond.is_addition_supported
                    ? "支持附加要求"
                    : ""
                }}
              </div>
              <img
                src="../../../static/img/icon-more.png"
                slot="reference"
                style="vertical-align: -5px"
                width="20"
                height="20"
                alt
              />
            </el-popover>
          </div>
          <div v-if="scope.row.is_offer == 0">非报价</div>
        </template>
      </el-table-column>
      <el-table-column label="是否符合条件" width="150" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-switch
              v-model="scope.row.is_eligible"
              @change="change(scope.row)"
              :active-value="1"
              :inactive-value="0"
              :disabled="is_offered == 1"
            ></el-switch>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-button :disabled="is_offered == 1" @click="submitClick" type="primary"
        >保存</el-button
      >
      <el-button @click="saveDraft">保存草稿</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {
      moment: moment,
      text: this.$route.query.text,
      // text: "", // 头部显示的悬赏文字 & 要求
      type: this.$route.query.type,
      quotas: this.$route.query.quotas,
      is_offered: parseInt(this.$route.query.is_offered) || 0,
      // is_offered: 0,
      search: {
        campaign_id: this.$route.query.id,
        type: parseInt(this.$route.query.type)
      },
      list: [],
      unique: ["合集", "非合集"],
      reviewsType: ["不限形式", "视频", "图文"], //评测形式
      reward: {}, // 悬赏
      originList: [], // 原始列表，用来做对比判断
      draftIdList: [] // 草稿id 列表
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 保存草稿
    async saveDraft() {
      let ids = [];
      this.list.map(item => {
        if (item.is_eligible == 1) {
          ids.push(item.order_id);
        }
      });
      let res = await this.$api.saveDraft({
        order_ids: ids,
        campaign_id: this.search.campaign_id
      });
      if (res.error_code == 0) {
        this.getList();
        this.$message.success("保存成功");
      }
    },
    //获取列表
    async getList() {
      let res = await this.$api.orderRewardList(this.$initReq(this.search));
      if (res.error_code == 0) {
        this.list = res.data ? res.data.list || [] : [];
        this.reward = res.data ? res.data.reward || {} : {};
      }
    },
    change() {
      let list = [];
      this.draftIdList = [];
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].is_eligible == 1) {
          list.push(this.list[i].order_id);
        }
      }
      let set = Array.from(new Set(list));
      this.draftIdList = set;
      if (set.length < list.length) {
        this.$message.error("有重复的博主,确认吗？");
      }
    },
    //提交审核
    submitClick() {
      let list = [], // 无报价
        offer_list = []; // 有报价
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].is_eligible == 1) {
          // 是否符合条件
          if (this.list[i].is_offer == 1) {
            // 有报价
            offer_list.push(this.list[i]);
          } else {
            list.push(this.list[i]);
          }
        }
      }
      if (list.length > this.quotas) {
        let number = list.length - this.quotas;
        this.$message.error("选择人数超了" + number);
        return false;
      } else {
        let allList = []; // 由于存在既有报价又有普通悬赏的用户，所以要去重
        allList = list.concat(offer_list); // 拼接数组
        allList = [...new Set(allList)]; // 数组去重
        this.$confirm(
          "确认后不可修改,确认选择当前" + allList.length + "个测评吗？",
          "温馨提示",
          {
            confirmButtonText: "必须的",
            cancelButtonText: "再想想"
          }
        )
          .then(async () => {
            let req = {
              campaign_id: this.search.campaign_id,
              list: list,
              offer_list: offer_list,
              type: this.search.type // 类型
            };
            let res = await this.$api.rewardAudit(req);
            if (res.error_code == 0) {
              this.$message.success("审核成功");
              this.is_offered = 1;
              //更改url
              this.$router.replace({
                name: "orderReward",
                query: {
                  id: this.search.campaign_id
                }
              });
            }
          })
          .catch(() => {
            return false;
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.page-order-reward {
  .footer {
    padding: 30px;
    text-align: center;
  }
}
</style>
