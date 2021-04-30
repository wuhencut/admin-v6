<template>
  <div class="blogger-search">
    <el-autocomplete
      class="search-inp"
      :fetch-suggestions="filterName"
      :placeholder="placeholder"
      @select="select"
      v-model.trim="current"
      :debounce="500"
      :disabled="disabled"
      @input="changeInput"
    ></el-autocomplete>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    disabled: Boolean,
    placeholder: String
  },
  watch: {
    disabled: {
      handler(val) {
        console.log("监听", val);
      },
      deep: true
    },
    value(val) {
      this.current = val;
    },
    current(val) {
      if (val == "") {
        this.$emit("select", val);
      }
    }
  },
  data() {
    return {
      nameList: [],
      current: this.value
    };
  },
  methods: {
    async filterName(queryString, cb) {
      if (queryString == "") {
        cb([]);
        return false;
      }
      let req = {
        cp_nickname: queryString,
        page_id: 1,
        page_size: 20
      };
      let res = await this.$api.registeCpSearch(req);
      if (res.error_code == 0) {
        this.nameList = res.data.list || [];
        for (let i = 0; i < this.nameList.length; i++) {
          this.nameList[i].value = this.nameList[i].nickname;
        }
      } else {
        this.nameList = [];
      }
      cb(this.nameList);
    },
    select(item) {
      this.$emit("input", this.current);
      this.$emit("select", item.user_id);
    },
    changeInput(value) {
      this.$emit("changeState", value);
    }
  }
};
</script>
