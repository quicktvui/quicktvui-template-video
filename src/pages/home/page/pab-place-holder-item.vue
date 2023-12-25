<template>
  <div class="tab-placeholder-item-root-css"
       flexStyle="${style}"
       :focusable="false"
       :enableFocusBorder="false">
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";

export default defineComponent({
  name: "pab-place-holder-item",
  setup(props, context) {
    return {
    }
  }
})
</script>

<style scoped>
.tab-placeholder-item-root-css {
  position: absolute;
  background-color: transparent;
  z-index: 1;
  display: flex;
}
</style>
