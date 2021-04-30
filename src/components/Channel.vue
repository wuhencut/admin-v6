<template>
  <div class="compoment-topic">
    <div class="card-list" v-if="value.length > 0">
      <el-row :gutter="0">
        <el-col :span="2" v-for="(item, index) in value" :key="index">
          {{ getPlatformName(item) }}
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
    disabled: Boolean
  },
  methods: {
    getPlatformName: getPlatformName
  }
};
</script>

<style lang="less" scoped></style>
