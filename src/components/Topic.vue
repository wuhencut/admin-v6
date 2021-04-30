<template>
  <div class="compoment-topic">
    <div class="card-list" v-if="value.length > 0">
      <el-row :gutter="2" style="width:600px;margin:0">
        <el-col
          :span="24"
          v-for="(item, index) in value"
          :key="index"
          style="margin-bottom:5px"
        >
          <span style="width:60px;display:inline-block;text-align:right"
            >{{ getPlatformName(item.channel) }}@</span
          >
          <el-input
            v-if="item.channel != 4 && item.account != ''"
            v-model="item.account"
            style="width:130px"
          ></el-input>
          <el-input
            v-else-if="item.channel != 4 && item.account == ''"
            v-model="item.account"
            placeholder="未填写"
            style="width:130px"
          ></el-input>
          <el-input
            v-else
            value="不支持"
            style="width:130px"
            disabled
          ></el-input>
          <!-- 第二个框 -->
          <span style="margin:0 10px;display:inline-block">#</span>
          <el-input
            v-if="item.channel != 4 && item.topic != ''"
            v-model="item.topic"
            style="width:180px"
          ></el-input>

          <el-input
            v-else-if="item.channel != 4 && item.topic == ''"
            v-model="item.topic"
            placeholder="未填写"
            style="width:180px"
          ></el-input>
          <el-input
            v-else
            value="不支持"
            style="width:180px"
            disabled
          ></el-input>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getPlatformName } from "../utils/platform";
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    candidate: {
      type: Array,
      default: () => {
        return [];
      }
    },
    disabled: Boolean
  },
  methods: {
    getPlatformName: getPlatformName
  }
};
</script>

<style lang="less" scoped>
.compoment-topic {
  width: 300px;
  margin: 0;
}
.card-list {
  width: 200px;
}
</style>
