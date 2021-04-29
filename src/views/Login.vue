<template>
	<div class="page"></div>
</template>
<script>
import { onMounted } from '@vue/runtime-core'
export default {
  setup() {
    console.log("setup")
    onMounted(() => {
      console.log("render")
    })
  },
  created() {
    console.log("created")
  },
  mounted() {
    console.log("mounted")
  }
}
</script>
