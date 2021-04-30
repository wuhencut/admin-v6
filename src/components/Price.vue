<template>
  <el-input v-model="currentValue" :disabled="disabled"></el-input>
</template>
<script>
export default {
  props: {
    value: {
      tyepe: Number,
      default: 0
    },
    disabled: Boolean
  },
  data() {
    return {
      currentValue: this.value > 0 ? (this.value / 100).toFixed(2) : ""
    };
  },
  watch: {
    value(value) {
      this.currentValue = value > 0 ? (value / 100).toFixed(2) : "";
    }
  }
};
</script>
