<template>
  <div class="media-player-placeholder-root-css"
       ref="placeholder"
       v-if="isShowing"
       @click="onClick"
       @focus="onFocus"
       name="placeholder"
       :focusable="true"
       :enableFocusBorder="true">
    <img class="media-player-placeholder-img-css"
         v-if="isMediaShowing"
         :duplicateParentState="true"
         :focusable="false"
         :enableFocusBorder="false"
         :src="mediaImg"/>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {IMedia} from "../../../datasource/media/IMedia";
import {ref} from "vue";
import {ESFocusable, useESFocus, useESToast} from "@extscreen/es3-core";

export default defineComponent({
  name: "media-player-placeholder",
  setup(props, context) {
    const focus = useESFocus()
    let media: IMedia
    const mediaImg = ref<string>("")
    const isMediaShowing = ref<boolean>(true)
    const isShowing = ref<boolean>(true)
    const toast = useESToast()
    const placeholder = ref<ESFocusable>()

    function initMedia(m: IMedia) {
      media = m
      mediaImg.value = m.coverH

      requestFocus()
    }

    function requestFocus(): void {
      if (placeholder.value) {
        focus.requestFocusDirectly(placeholder.value!)
      }
    }

    function showMediaInfo(value: boolean) {
      isMediaShowing.value = value
    }

    function show(value: boolean) {
      isShowing.value = value
    }

    function onClick() {
      context.emit('onPlaceholderClick')
    }

    function onFocus(e) {
      context.emit('onPlaceholderFocus', e.isFocused)
    }

    return {
      placeholder,
      initMedia,
      mediaImg,
      showMediaInfo,
      show,
      isMediaShowing,
      isShowing,
      onClick,
      onFocus,
      requestFocus
    }
  },
});

</script>

<style scoped>
.media-player-placeholder-root-css {
  width: 898px;
  height: 508px;
  position: absolute;
  left: 86px;
  top: -4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.media-player-placeholder-img-css {
  width: 890px;
  height: 500px;
  background-color: transparent;
}

</style>
