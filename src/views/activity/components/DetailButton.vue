<template>
  <div class="page">
    <el-button type="text" @click="getDetail">详情</el-button>
    <!-- 详情dg -->
    <el-dialog
      title="活动详情"
      append-to-body
      :visible.sync="dialogFormVisible"
      width="900px"
    >
      <el-form style="z-index: 2001" label-width="80px" label-position="left">
        <div class="info-title">基础信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="活动ID">
              <el-input
                v-model="activity.campaign_id"
                disabled
                maxlength="30"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="活动名称">
              <el-input v-model="activity.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="活动类型">
              <el-input
                v-if="activity.type"
                value="达人探店"
                disabled
              ></el-input>
              <el-input v-else disabled value="好物测评"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动时间">
              <el-date-picker
                :disabled="time"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="开始时间"
                :picker-options="startTimeOptions"
                v-model="activity.start_time"
                @change="changeStartTime"
                style="width:140px"
              ></el-date-picker>
              <!-- :disabled="identity == 0 || activity.status == 1" -->
              <el-date-picker
                :disabled="time"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="结束时间"
                v-model="activity.end_time"
                :picker-options="endTimeOptions"
                @change="changeEndTime"
                style="width:140px;margin-left:10px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动名额">
              <el-input-number
                :disabled="places"
                v-model="activity.total_num"
                :precision="0"
                :min="0"
                :max="1000"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称">
              <el-input v-model="activity.production_title" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动规格" prop="production_specs">
              <el-select
                :disabled="specification"
                v-model="activity.production_specs"
                multiple
                collapse-tags
                value-key="id"
                placeholder="请选择规格"
              >
                <el-option
                  v-for="item in specslist"
                  :key="item.id"
                  :label="(item.name == null ? [] : item.name).join('-')"
                  :value="item"
                ></el-option>
              </el-select>

              <!-- el-option里的商品规格应该是product里的specs -->
              <!-- <el-input v-model="activity.name"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <div class="info-title">活动设置</div>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="私密活动">
              <el-tag v-if="activity.secret" type="success">已开启</el-tag>
              <el-tag v-else type="danger">未开启</el-tag>
            </el-form-item>
          </el-col>
          <!--试用活动-->
          <div v-if="activity.type == 0">
            <el-col :span="5">
              <el-form-item label="商品置换">
                <el-tag v-if="activity.exchange_production" type="success"
                  >已开启</el-tag
                >
                <el-tag v-else type="danger">未开启</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="收货地限制" label-width="90px">
                <el-tag v-if="activity.address_limit" type="success"
                  >已开启</el-tag
                >
                <el-tag v-else type="danger">未开启</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div
                v-if="
                  activity.address_limit &&
                    activity.address_limit_info.area != ''
                "
              >
                <el-popover placement="right" width="80" trigger="click">
                  <div v-if="activity.address_limit_info.area_type == 2">
                    <h3>不可收货地址为:</h3>
                    {{ activity.address_limit_info.area.join(",") }}
                  </div>
                  <div v-if="activity.address_limit_info.area_type == 1">
                    <h3>可收货地址为:</h3>
                    {{ activity.address_limit_info.area.join(",") }}
                  </div>
                  <el-button slot="reference">查看</el-button>
                </el-popover>
              </div>
            </el-col>
            <el-col :span="5">
              <el-form-item label="粉丝福利">
                <el-tag v-if="activity.welfare_status" type="success"
                  >已开启</el-tag
                >
                <el-tag v-else type="danger">未开启</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div v-if="activity.welfare_status == true">
                <el-form-item label="福利数量">
                  <el-input
                    disabled
                    :value="activity.welfare_number || 1"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </div>
          <!-- 试用活动 -->

          <!--探店活动-->
          <div v-if="activity.type == 2">
            <el-col :span="5">
              <el-form-item label="需要预约" label-width="70px">
                <el-input
                  v-if="activity.need_reservation"
                  value="已开启"
                  disabled
                ></el-input>
                <el-input v-else disabled value="未开启"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="预约天数"
                v-if="activity.need_reservation"
                label-width="70px"
              >
                <el-input
                  disabled
                  v-model="activity.reservation_days"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2.5">
              <div style="height:32px;line-height:32px">活动地址</div>
            </el-col>
            <el-col :span="2">
              <!-- <div v-if="activity.address_limit"> -->
              <el-popover placement="right" width="80" trigger="click">
                <div
                  v-for="(item, index) in activity.shop_address"
                  :key="index"
                >
                  {{ index + 1 }}、{{ item.name + item.tel }}
                  <br />
                  {{ item.cityname + item.adname + item.address }}
                </div>
                <el-button slot="reference">查看</el-button>
              </el-popover>
              <!-- </div> -->
            </el-col>
          </div>

          <!--探店活动-->
        </el-row>
        <div class="info-title">渠道信息</div>
        <!-- 测评指引 -->
        <el-form-item label="测评指引">
          <guide-list v-model="activity.review_guide"></guide-list>
        </el-form-item>
        <!-- 测评渠道 -->
        <el-form-item
          label="测评渠道"
          v-if="activity.reward.channel.length > 0"
        >
          <channel
            :value="Array.from(new Set(activity.reward.channel))"
            disabled
          ></channel>
        </el-form-item>

        <!--推广悬赏 -->
        <el-form-item label="推广悬赏">
          <el-tag v-if="activity.reward.form.enable" type="success"
            >已开启</el-tag
          >
          <el-tag v-else type="danger">未开启</el-tag>
        </el-form-item>
        <el-form-item label="合作模式" v-if="activity.package > 0">
          {{ coopList[activity.package] }}
        </el-form-item>
        <template v-if="activity.reward.form.creative_theme">
          <el-form-item label="创作方向">{{
            activity.reward.form.creative_theme
          }}</el-form-item>
          <el-form-item label="图片要求">
            <el-input
              :disabled="creativeDisabled"
              placeholder="图片要求"
              type="textarea"
              :rows="2"
              v-model="activity.reward.form.creative_needs['图片要求']"
            ></el-input>
          </el-form-item>
          <el-form-item label="文案要求">
            <el-input
              :disabled="creativeDisabled"
              placeholder="文案要求"
              type="textarea"
              v-model="activity.reward.form.creative_needs['文案要求']"
            ></el-input>
          </el-form-item>
          <el-form-item label="注意事项">
            <el-input
              :disabled="creativeDisabled"
              placeholder="注意事项"
              type="textarea"
              v-model="activity.reward.form.creative_needs['注意事项']"
            ></el-input>
          </el-form-item>
          <el-form-item label="参考链接	">
            <el-input
              :disabled="creativeDisabled"
              placeholder="参考链接	"
              v-model="activity.reward.form.reference_url"
            ></el-input>
          </el-form-item>
        </template>
        <div v-show="activity.reward.form.enable">
          <!-- 测评内容 -->
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="测评内容">
                <el-input
                  v-if="activity.reward.form.is_collection == 0"
                  value="非合集测评"
                  disabled
                ></el-input>
                <el-input
                  v-if="activity.reward.form.is_collection == 1"
                  value="不限"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="测评形式">
                <el-input
                  v-if="activity.reward.form.form == 1"
                  value="视频"
                  disabled
                ></el-input>
                <el-input
                  v-if="activity.reward.form.form == 2"
                  value="图文"
                  disabled
                ></el-input>
                <el-input
                  v-if="activity.reward.form.form == 0"
                  value="不限"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="视频长度"
                v-if="
                  activity.reward.form.form == 1 &&
                    activity.reward.form.video_duration != 0
                "
              >
                <el-input
                  v-model="activity.reward.form.video_duration"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item
                label="最低字数"
                v-if="
                  activity.reward.form.form == 2 &&
                    activity.reward.form.word_count != 0
                "
              >
                <el-input
                  v-model="activity.reward.form.word_count"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="最低图片数"
                label-width="90px"
                v-show="
                  activity.reward.form.form == 2 &&
                    activity.reward.form.picture_count != 0
                "
              >
                <el-input
                  v-model="activity.reward.form.picture_count"
                  disabled
                ></el-input>
              </el-form-item>
              <!--  账号话题-->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <div v-show="activity.reward.form.extension_channel.length > 0">
                <el-form-item label="账号话题">
                  <topic
                    v-model="activity.reward.form.extension_channel"
                    disabled
                  ></topic>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <!--优惠信息-->
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                label="优惠信息"
                v-show="activity.reward.form.extension_preferential"
              >
                <el-input
                  v-model="activity.reward.form.extension_preferential"
                  maxlength="150"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 附带关键词 -->

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                label="附带关键词"
                label-width="90px"
                v-show="activity.reward.form.keywords.length > 0"
              >
                <input-keywords
                  v-for="(item, index) in activity.reward.form.keywords"
                  v-model="activity.reward.form.keywords[index]"
                  :key="index"
                  style="width:200px;margin-left:10px;height:32px"
                ></input-keywords>
              </el-form-item>
            </el-col>
          </el-row>
          <!--发布时间-->
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item
                label="发布时间"
                v-show="activity.reward.form.publish_time"
              >
                <el-date-picker
                  disabled
                  value-format="yyyy-MM-dd"
                  v-model="activity.reward.form.publish_time"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!--悬赏金额-->
          <!-- <el-row :gutter="20">
            <el-col :span="7">
              <div class="grid-content bg-purple">
                <el-form-item label="推广悬赏金额" label-width="100px">
                  <price disabled v-model="activity.reward.form.bounty"></price>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content bg-purple">
                <span style="display:inline-block;width:50px;margin-top:10px"
                  >映币/人</span
                >
              </div>
            </el-col>
          </el-row> -->
          <el-form-item label="悬赏金额">
            <div class="wrapper-reward">
              <div>{{ activity.reward.form.bounty / 100 }} 映币/人</div>
              <template v-if="JSON.stringify(activity.fans_markup) != '{}'">
                <div
                  class="item"
                  style="display: flex;"
                  v-for="(value, key) in activity.fans_markup"
                  :key="key"
                >
                  <div class="title">{{ getPlatformName(key) }}</div>
                  <div>
                    <div
                      class="content"
                      v-for="(item, index) in value"
                      :key="index"
                    >
                      {{ item.fans_num / 10000 }} 万粉以上，额外悬赏
                      {{ item.price / 100 }} 映币/人
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </el-form-item>
          <!--排名悬赏-->
          <div v-if="activity.reward.rank.enable">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="排名悬赏">
                  <el-tag type="success">已开启</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="排名指标">
                  <el-input
                    v-if="activity.reward.rank.rank_target == 1"
                    disabled
                    value="测评创意"
                  ></el-input>
                  <el-input
                    v-else-if="activity.reward.rank.rank_target == 2"
                    disabled
                    value="内容质量"
                  ></el-input>
                  <el-input v-else disabled value="无"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-form-item label="悬赏金额">
                    <div class="disabled-area">
                      {{ (activity.reward.rank.total_bounty / 100).toFixed(2) }}
                    </div>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="1">
                <div class="grid-content bg-purple">
                  <span style="display:inline-block;width:50px;margin-top:10px"
                    >映币</span
                  >
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 接收报价 -->
        <el-form-item label="接受报价">
          <el-tag v-if="activity.quoted == 1" type="success">已开启</el-tag>
          <el-tag v-if="activity.quoted == 0" type="danger">未开启</el-tag>
        </el-form-item>

        <div class="info-title">活动转化</div>
        <el-form-item label="商品售卖">
          <el-tag type="success" v-if="activity.production_status == 0"
            >已上架</el-tag
          >
          <el-tag type="danger" v-else>未上架</el-tag>
        </el-form-item>
        <el-form-item label="粉丝福利">
          <div class="item" v-if="activity.fans_coupon_detail">
            <p class="title">粉丝优惠</p>
            <div class="list">
              <div
                v-if="activity.fans_coupon_detail.production_type"
                class="coupen"
              >
                {{
                  activity.fans_coupon_detail.production_type == 1
                    ? "全部商品可用"
                    : "部分商品可用"
                }}
              </div>
              <div class="coupen" v-if="activity.fans_coupon_detail.amount">
                {{
                  `满${activity.fans_coupon_detail.amount / 100} 减 ${activity
                    .fans_coupon_detail.discount_amount / 100}`
                }}
              </div>
              <div
                class="coupen"
                v-if="
                  activity.fans_coupon_detail.amount == 0 &&
                    activity.fans_coupon_detail.discount_amount > 0
                "
              >
                {{
                  `立减 ${activity.fans_coupon_detail.discount_amount / 100}`
                }}
              </div>
              <div v-if="activity.fans_coupon_detail.limit_type" class="coupen">
                {{
                  activity.fans_coupon_detail.limit_type == 1
                    ? `领取限${activity.fans_coupon_detail.limit_count}次`
                    : "领取不限次数"
                }}
              </div>
              <div
                v-if="activity.fans_coupon_detail.limit_together"
                class="coupen"
              >
                {{
                  activity.fans_coupon_detail.limit_together.indexOf("1") > -1
                    ? "不能和其他优惠同享"
                    : "能和其他优惠同享"
                }}
              </div>
              <div
                v-if="activity.fans_coupon_detail.limit_together"
                class="coupen"
              >
                {{
                  activity.fans_coupon_detail.limit_together.indexOf("2") > -1
                    ? "不能累加返利"
                    : "能累加返利"
                }}
              </div>
              <div
                class="coupen"
                v-if="activity.fans_coupon_detail.expiration_time > 0"
              >
                {{
                  `领券后${activity.fans_coupon_detail.expiration_time}天后过期`
                }}
              </div>
              <div v-if="activity.fans_coupon_detail.open > -1" class="coupen">
                {{
                  activity.fans_coupon_detail.open == 0
                    ? "不公开领"
                    : "公开领取"
                }}
              </div>
            </div>
          </div>
          <div class="item" v-if="activity.lottery_coupon_detail">
            <p class="title">抽奖互动</p>
            <div class="list">
              <div
                v-if="activity.lottery_coupon_detail.production_type"
                class="coupen"
              >
                {{
                  activity.lottery_coupon_detail.production_type == 1
                    ? "全部商品可用"
                    : "部分商品可用"
                }}
              </div>
              <div class="coupen" v-if="activity.lottery_coupon_detail.amount">
                {{
                  `满${activity.lottery_coupon_detail.amount /
                    100} 减 ${activity.lottery_coupon_detail.discount_amount /
                    100}`
                }}
              </div>
              <div
                class="coupen"
                v-if="
                  activity.lottery_coupon_detail.amount == 0 &&
                    activity.lottery_coupon_detail.discount_amount > 0
                "
              >
                {{
                  `立减${activity.lottery_coupon_detail.discount_amount / 100}`
                }}
              </div>
              <div
                v-if="activity.lottery_coupon_detail.limit_type"
                class="coupen"
              >
                {{
                  activity.lottery_coupon_detail.limit_type == 1
                    ? `领取限${activity.lottery_coupon_detail.limit_count}次`
                    : "领取不限次数"
                }}
              </div>
              <div
                v-if="activity.lottery_coupon_detail.limit_together"
                class="coupen"
              >
                {{
                  activity.lottery_coupon_detail.limit_together.indexOf("1") >
                  -1
                    ? "不能和其他优惠同享"
                    : "能和其他优惠同享"
                }}
              </div>
              <div
                v-if="activity.lottery_coupon_detail.limit_together"
                class="coupen"
              >
                {{
                  activity.lottery_coupon_detail.limit_together.indexOf("2") >
                  -1
                    ? "不能累加返利"
                    : "能累加返利"
                }}
              </div>
              <div
                class="coupen"
                v-if="activity.lottery_coupon_detail.expiration_time > 0"
              >
                {{
                  `领券后${activity.lottery_coupon_detail.expiration_time}天后过期`
                }}
              </div>
              <div
                class="coupen"
                v-if="activity.lottery_coupon_detail.open > -1"
              >
                {{
                  activity.lottery_coupon_detail.open == 0
                    ? "不公开领"
                    : "公开领取"
                }}
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商品晒单">
          <el-tag type="success" v-if="activity.production_rebate_status == 1"
            >已开启</el-tag
          >
          <el-tag type="danger" v-else>未开启</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="saveBtnClick" type="primary">保存</el-button>
      </div>
    </el-dialog>
    <!-- 详情dg -->
  </div>
</template>
<script>
import GuideList from "../../../components/GuideList";
// import Price from "../../../components/Price";
import Channel from "../../../components/Channel";
import Topic from "../../../components/Topic";
import { getPlatformName } from "../../../utils/platform";
import InputKeywords from "../../../components/input/InputKeywords";
import moment from "moment";

export default {
  name: "ActivityDetail",
  components: {
    GuideList,
    // Price, //价格格式改变组件
    Channel, //获取测评渠道并展示的组件
    Topic, //获取账号话题的组件
    InputKeywords
  },
  data() {
    return {
      getPlatformName: getPlatformName,
      coopList: {
        1: "自定义悬赏",
        2: "免费置换",
        3: "基础套餐",
        4: "标准套餐",
        5: "高级套餐"
      },
      places: false,
      dialogFormVisible: false, // 详情弹窗
      time: true,
      specslist: [], //获取商品规格的列表
      activity: {
        fans_coupon_detail: {
          limit_together: []
        },
        lottery_coupon_detail: {
          limit_together: []
        },
        production_specs: [],
        reward: {
          form: {
            extension_channel: [],
            keywords: []
          },
          rank: {},
          channel: []
        }
      },
      specification: true
    };
  },
  props: {
    // 传过来的列表数据
    activityData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {},
  computed: {
    creativeDisabled() {
      if (this.activityData.status == 101 || this.activityData.status == 4) {
        return false;
      } else {
        return true;
      }
    },
    startTimeOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000;
        }
      };
    },
    endTimeOptions() {
      let start_time = new Date(this.activity.start_time).getTime();
      return {
        disabledDate(time) {
          return time.getTime() < start_time;
        }
      };
    }
  },
  methods: {
    //获取商品的规格
    async getProduct() {
      let res = await this.$api.getProductionSpecList({
        production_id: this.activity.production_id
      });
      if (res.error_code == 0) {
        this.specslist = res.data.list;
      }
    },
    async getDetail() {
      this.places = true;
      if (this.activityData.status == "101") {
        this.time = false;
        this.specification = false;
      } else {
        this.time = true;
        this.specification = true;
      }
      this.dialogFormVisible = true;
      let req = {
        campaign_id: this.activityData.campaign_id
      };
      let res = await this.$api.getCampaignDetail(req);
      if (res.error_code == 0) {
        let activity = res.data;
        activity.review_guide = activity.review_guide || [];
        activity.production_specs = activity.production_specs || [];
        activity.address_limit_info.area =
          activity.address_limit_info.area || [];
        activity.shop_address = activity.shop_address || [];
        activity.reward.channel = activity.reward.channel || [];
        activity.reward.form.extension_channel =
          activity.reward.form.extension_channel || [];
        activity.reward.form.keywords = activity.reward.form.keywords || [];

        this.activity = activity;
        //推广悬赏||排名悬赏
        if (
          this.activity.reward.form.enable == false &&
          this.activity.reward.rank.enable == false &&
          this.activity.express_point == 0
        ) {
          this.places = false;
        }
        this.getProduct();
        // 获取详情点击之后的商品的具体信息
      }
    },
    //修改活动
    async saveBtnClick() {
      this.activity.specs = [];
      if (
        this.activity.production_specs != "" &&
        this.activity.title != "" &&
        this.activity.start_time != null &&
        this.activity.end_time != null &&
        !this.activity.reward.form.keywords.includes("")
      ) {
        this.activity.total_num = Number(this.activity.total_num);
        let obj = { ...this.activity };
        let req = obj;
        let res = await this.$api.campaignModify(req);
        if (res.error_code == 0) {
          this.$emit("updateList");
          this.dialogFormVisible = false;
        }
      } else {
        this.$message.error(
          "活动名称、活动规格、活动时间、附带关键词只能修改，不能删除！"
        );
        this.dialogFormVisible = true; //为了防止alert点确定以后
      }
    },
    changeEndTime() {},
    //切换时间
    changeStartTime(val) {
      let endTime = new Date(val).getTime() + 5 * 24 * 3600 * 1000;
      this.activity.end_time = moment(endTime).format("YYYY-MM-DD");
    }
  }
};
</script>
<style lang="less">
.wrapper-reward {
  > .item {
    display: flex;
    padding-bottom: 10px;
    border-bottom: 1px solid #dedede;
    > .title {
      padding-right: 20px;
    }
  }
}
.disabled-area {
  display: inline-block;
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  height: 32px;
  line-height: 32px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 0 15px;
  width: 100px;
}
.item {
  .title {
    font-weight: bold;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .coupen {
      padding: 4px 10px;
      border: 1px solid #dedede;
      margin-bottom: 10px;
      margin-right: 4px;
    }
  }
}
</style>
