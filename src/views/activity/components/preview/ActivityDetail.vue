<template>
  <div class="activity-detail">
    <div class="good-detail">
      <div class="detail-info">
        <p class="info-title">商品信息</p>
        <p>
          商品名称： <i class="txt-gray">{{ previewData.title }}</i>
        </p>
        <p>
          活动类型：
          <i class="txt-gray">{{ activityType[previewData.type - 1] }}</i>
        </p>
        <p>
          商品类目：
          <i class="txt-gray"
            >{{ previewData.category }} {{ previewData.level_two_category }}</i
          >
        </p>
        <p v-if="previewData.spotlights">
          商品卖点：
          <i
            v-for="(item, index) in previewData.spotlights"
            :key="index"
            class="txt-gray"
            >{{ item }}
          </i>
        </p>
        <p>
          商品数量： <i class="txt-gray">{{ previewData.count }}</i>
        </p>
        <div
          class="spec-outer"
          v-if="
            previewData.specification_list &&
              previewData.specification_list.length
          "
        >
          <i style="vertical-align: top">活动规格:</i>
          <div class="spec">
            <div class="list-item">
              <p>规格</p>
              <p>数量</p>
              <p>价格</p>
            </div>
            <div
              :key="index"
              v-for="(item, index) in previewData.specification_list"
              class="list-item-spec"
            >
              <p>{{ item.specification }}</p>
              <p>{{ item.specification_remain }}</p>
              <p>{{ item.price }}</p>
            </div>
          </div>
        </div>
        <p>
          活动时间：
          <i class="txt-gray">{{ createTime }} ---- {{ deadTime }}</i>
        </p>
        <p>
          私密活动：
          <i class="txt-gray">{{ previewData.secret == true ? "是" : "否" }}</i>
        </p>
        <p v-if="previewData.type == 2">
          折扣力度：<i class="txt-gray">{{ previewData.discount }}折</i>
        </p>
        <p v-if="previewData.type == 2">
          折扣总额：<i class="txt-gray"
            >{{ previewData.discount_point / 100 }}元</i
          >
        </p>
        <p v-if="previewData.type == 2">
          手续总额：<i class="txt-gray"
            >{{ previewData.service_point / 100 }}映币</i
          >
        </p>
        <p>
          博主报价：
          <i class="txt-gray">{{
            previewData.blogger_quote ? "接受" : "拒绝"
          }}</i>
        </p>
        <div class="spec-outer">
          <i>收货限制：</i>
          <i v-if="!previewData.receipt_limit" class="txt-gray">不限</i>
          <div v-else class="spec">
            <div class="txt-gray" v-if="previewData.receipt_accept_list">
              <p style="margin-bottom: 4px;" class="txt-gray">可收货地址:</p>
              <span
                v-for="(item, index) in previewData.receipt_accept_list"
                :key="index"
              >
                {{ item }}
                <span v-if="index < previewData.receipt_accept_list.length - 1"
                  >、</span
                >
              </span>
            </div>
            <hr
              v-if="
                previewData.receipt_accept_list &&
                  previewData.receipt_refuse_list
              "
            />
            <div v-if="previewData.receipt_refuse_list">
              <p style="margin-bottom: 4px;" class="txt-gray">不可收货地址:</p>
              <div class="txt-gray">
                <span
                  v-for="(item, index) in previewData.receipt_refuse_list"
                  :key="index"
                  >{{ item
                  }}<span
                    v-if="index < previewData.receipt_refuse_list.length - 1"
                    >、</span
                  ></span
                >
              </div>
            </div>
          </div>
        </div>
        <p>
          物流发放形式：<i class="txt-gray">{{
            previewData.express_type == 2 ? "平台代发" : "商家发货"
          }}</i>
        </p>
        <p v-if="previewData.order == 1">
          需要预约：
          <i class="txt-gray">提前{{ previewData.order_date }}天预约</i>
        </p>
        <p v-if="previewData.hasFansBenefits">
          粉丝福利：
          <i class="txt-gray"
            >每个名额 {{ previewData.fansBenefitsCount }} 件</i
          >
        </p>
        <!--赏金规则-->
        <div class="reward-rule" v-if="previewData.reward.form.enable">
          <p class="info-title">
            推广悬赏
          </p>
          <p>
            合集测评：
            <i class="txt-gray">{{
              previewData.reward.form.is_collection == 1 ? "是" : "否"
            }}</i>
          </p>
          <p>
            评测形式：
            <i class="txt-gray">{{
              reviewsType[previewData.reward.form.form]
            }}</i>
          </p>
          <div class="review-channel">
            <div v-if="previewData.reward.form.channels">
              <p>
                测评渠道：
                <i
                  :key="index"
                  v-for="(item, index) in previewData.reward.form.channels"
                  class="txt-gray"
                  >{{ $getPlatformName(item) }}
                  <i v-if="index < previewData.reward.form.channels.length - 1"
                    >/</i
                  >
                </i>
              </p>
            </div>
            <div>
              <p v-if="previewData.reward.form.extension_channel">
                <i style="vertical-align: top">推广要求：</i>
                <i style="display: inline-block; vertical-align: top">
                  <i
                    class="txt-gray"
                    v-for="(item, index) in previewData.reward.form
                      .extension_channel"
                    :key="index"
                  >
                    {{ $getPlatformName(item.channel) }} @ {{ item.account
                    }}<br />
                    话题 # {{ item.topic }}
                    <br />
                  </i>
                </i>
              </p>
            </div>
            <div v-if="previewData.reward.form.extension_preferential">
              <p>
                优惠信息：
                <i class="txt-gray">{{
                  previewData.reward.form.extension_preferential
                }}</i>
              </p>
            </div>
            <!-- <p v-if="previewData"></p> -->
            <div style="display: flex; margin-bottom: 20px;">
              <div class="num-per" style="flex: 1">
                <i style="vertical-align: top">赏金设置：</i><br />
                <i v-if="previewData.reward.form.enable" class="txt-gray"
                  >{{ previewData.reward.form.bounty / 100 }} /人</i
                >
              </div>
              <div class="after-diff" style="flex: 1">
                <i style="vertical-align: top">抽佣后：</i><br />
                <i v-if="previewData.reward.form.enable" class="txt-gray"
                  >{{
                    Math.floor((previewData.reward.form.bounty * 0.6366) / 100)
                  }}
                  /人</i
                >
              </div>
            </div>
            <p>
              名额：
              <i class="txt-gray">{{ previewData.reward.form.quotas }}人</i>
            </p>
            <p>
              总额：
              <i class="txt-gray"
                >{{ previewData.reward.form.total_bounty / 100 }}映币</i
              >
            </p>
            <p v-if="previewData.reward.form.publish_time">
              发布时间：
              <i class="txt-gray">{{ previewData.reward.form.publish_time }}</i>
            </p>
            <p v-if="previewData.reward.form.keywords">
              附带关键词：
              <i
                class="txt-gray"
                v-for="(item, index) in previewData.reward.form.keywords"
                :key="index"
                >{{ item
                }}<i v-if="index < previewData.reward.form.keywords.length - 1"
                  >、</i
                ></i
              >
            </p>
            <p v-if="previewData.reward.form.word_count">
              最低字数：
              <i class="txt-gray">{{ previewData.reward.form.word_count }}字</i>
            </p>
            <p v-if="previewData.reward.form.picture_count">
              最低图片数：
              <i class="txt-gray"
                >{{ previewData.reward.form.picture_count }}张图</i
              >
            </p>
          </div>
        </div>
        <div class="reward-rule" v-if="previewData.reward.rank.enable">
          <p class="info-title">
            排名悬赏
          </p>
          <p>
            合集测评：
            <i class="txt-gray">{{
              previewData.reward.rank.is_collection == 1 ? "是" : "否"
            }}</i>
          </p>
          <div class="review-channel">
            <!-- <p v-if="previewData"></p> -->
            <div
              v-if="previewData.reward.rank.enable"
              style="display: flex; margin-bottom: 20px;"
            >
              <div class="num-per" style="flex: 1">
                <i style="vertical-align: top">赏金设置：</i><br />
                <i
                  v-if="previewData.reward.rank.enable"
                  class="txt-gray"
                  style="display: inline-block"
                >
                  <i
                    v-for="(value, key, index) in previewData.reward.rank
                      .bounty"
                    :key="index"
                    >第{{ key }}名: {{ value / 100 }} 映币<br
                  /></i>
                </i>
              </div>
              <div class="after-diff" style="flex: 1">
                <i style="vertical-align: top">抽佣后：</i><br />
                <i
                  v-if="previewData.reward.rank.enable"
                  class="txt-gray"
                  style="display: inline-block"
                >
                  <i
                    v-for="(value, key, index) in previewData.reward.rank
                      .bounty"
                    :key="index"
                    >第{{ key }}名:
                    {{ Math.floor((value * 0.6366) / 100) }}
                    映币<br
                  /></i>
                </i>
              </div>
            </div>
            <p>
              名额：
              <i class="txt-gray">{{ previewData.reward.rank.quotas }}人</i>
            </p>
            <p v-if="previewData.reward.rank.enable">
              总额：
              <i v-if="previewData.reward.rank.enable" class="txt-gray"
                >{{ previewData.reward.rank.total_bounty / 100 }}映币</i
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: ["value"],
  name: "ActivityDetail",
  data() {
    return {
      moment: moment, //
      previewData: {
        reward: {
          form: {},
          rank: {}
        }
      },
      createTime: "",
      deadTime: "", //起始时间，截止时间
      activityType: ["试用活动", "折扣活动", "探店活动"],
      reviewsType: ["不限形式", "视频", "图文"] //评测形式
    };
  },
  mounted() {
    this.previewData = this.value;
    this.createTime = moment(this.previewData.start_time * 1000).format(
      "YYYY-MM-DD"
    );
    this.deadTime = moment(this.previewData.end_time * 1000).format(
      "YYYY-MM-DD"
    );
  }
};
</script>

<style>
.detail-info {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
}

.spec-outer {
  display: flex;
  margin-bottom: 20px;
}

.spec {
  padding-left: 10px;
  flex: 1;
}

.list-item-spec,
.list-item {
  display: flex;
}

.list-item-spec p {
  color: #9f9da1;
}

.spec p {
  flex: 1;
}

.detail-info p {
  margin-bottom: 20px;
}

.info-title {
  line-height: 50px;
  text-align: center;
  font-size: 20px;
}

i {
  font-style: normal;
}
</style>
