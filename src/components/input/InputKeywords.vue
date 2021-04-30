<template>
  <div class="el-input">
    <input
      class="el-input__inner"
      v-model="currentValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="input"
      style="height:32px"
    />
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    length: {
      type: Number,
      default: 7
    },
    disabled: Boolean,
    placeholder: {
      type: String,
      default: "请输入关键词"
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    }
  },
  methods: {
    input(e) {
      let str = String(e.target.value.trim());
      let temp = "";
      let refLen = 0;
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          refLen += 2;
        } else {
          refLen++;
        }
        if (refLen <= this.length * 2) {
          temp += str[i];
        }
      }
      this.currentValue = temp;
      this.$emit("input", this.currentValue);
    }
  }
};
</script>
