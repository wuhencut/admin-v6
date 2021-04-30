<template>
  <div class="team-search">
    <el-autocomplete
      class="search-inp"
      v-model.trim="current"
      :fetch-suggestions="filterTeam"
      placeholder="联盟战队"
      @select="select"
      :debounce="500"
    ></el-autocomplete>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    disabled: Boolean
  },
  watch: {
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
      teamList: [],
      current: this.value
    };
  },
  methods: {
    //筛选战队
    async filterTeam(queryString, cb) {
      if (queryString === "") {
        cb([]);
        return false;
      }
      let req = {
        team_name: queryString
      };
      let res = await this.$api.getTeamName(req);
      if (res.error_code == 0) {
        this.teamList = res.data.list || [];
        for (let i = 0; i < this.teamList.length; i++) {
          this.teamList[i].value = this.teamList[i].team_name;
        }
      } else {
        this.teamList = [];
      }
      cb(this.teamList);
    },
    select(item) {
      this.$emit("input", this.current);
      this.$emit("select", item.team_id);
    }
  }
};
</script>
