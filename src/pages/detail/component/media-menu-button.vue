<template>
  <div :focusable="true"
       @focus="onFocus"
       @click="onClick"
       ref="menuItemRef"
       class="menu-button-item-icon-css">
    <div class="menu-button-item-img-root-css">
      <img class="menu-button-item-img-css"
           :duplicateParentState="true"
           :focusable="false"
           showOnState="focused"
           :src="focusIcon"/>
      <img class="menu-button-item-img-css"
           :duplicateParentState="true"
           :focusable="false"
           showOnState="normal"
           :src="icon"/>
    </div>
    <span class="menu-button-item-text-css"
          :duplicateParentState="true">{{ text }}</span>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";
import {Native} from "@extscreen/es3-vue";

export default defineComponent({
  name: "media-menu-button",
  props: {
    icon: {
      type: String,
      default: ''
    },
    focusIcon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
  },
  setup(props, context) {
    const focused = ref(false)
    const menuItemRef = ref()

    function onFocus(e) {
      focused.value = e.isFocused;
      context.emit("focus", e.isFocused);
    }

    function onClick(e) {
      context.emit("click");
    }

    function requestItemFocus() {
      Native.callUIFunction(menuItemRef.value, 'requestFocus', []);
    }

    return {
      menuItemRef,
      focused,
      onFocus,
      onClick,
      requestItemFocus
    }
  },
});
</script>

<style scoped>
.menu-button-item-icon-css {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  focus-background-color: #FFF5F5F5;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  margin-right: 16px;
}

.menu-button-item-img-css {
  width: 46px;
  height: 46px;
  position: absolute;
}

.menu-button-item-text-css {
  width: 140px;
  height: 30px;
  color: rgba(255, 255, 255, 0.6);
  focus-color: black;
  select-color: black;
  align-self: center;
  font-size: 28px;
  text-align: center;
  font-weight: 400;
  margin-top: 15px;
}

.menu-button-item-img-root-css {
  width: 46px;
  height: 46px;
}

</style>
