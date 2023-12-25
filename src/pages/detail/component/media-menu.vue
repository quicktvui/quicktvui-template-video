<template>
  <qt-row class="media-menu-root-css">

    <media-menu-button
      :icon="fullButtonNormal"
      text="全屏"
      @click="onFullButtonClick"
      :focus-icon="fullButtonFocused"/>

    <media-menu-vip-button
      v-if="!authenticated"
      @click="onFullButtonClick"/>

    <media-menu-button
      :focus-icon="favButtonFocused"
      :icon="favButtonNormal"
      text="收藏"
      @click="onFullButtonClick"/>

  </qt-row>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {IMedia} from "../../../datasource/media/IMedia";
import {useESRouter} from "@extscreen/es3-router";
import media_menu_button from './media-menu-button.vue'
import media_menu_vip_button from './media-menu-vip-button.vue'

import fullButtonFocused from "../../../assets/ic_media_full_button_focused.png";
import fullButtonNormal from "../../../assets/ic_media_full_button_normal.png";

import favButtonFocused from "../../../assets/ic_media_fav_button_focused.png";
import favButtonNormal from "../../../assets/ic_media_fav_button_normal.png";

import {useESEventBus} from "@extscreen/es3-core";
import {IMediaAuthorization} from "../../../datasource/media/IMediaAuthorization";
import {inject, ref, watch} from "vue";
import {mediaAuthorizationKey} from "../injectionSymbols";

export default defineComponent({
  name: "media-menu",
  components: {
    'media-menu-button': media_menu_button,
    'media-menu-vip-button': media_menu_vip_button,
  },
  emits: [
    'onFullButtonClick'
  ],
  setup(props, context) {

    const authenticated = ref<boolean>(false)

    const mediaAuthorization = inject(mediaAuthorizationKey)
    const eventbus = useESEventBus()
    let m: IMedia

    watch(
      () => [mediaAuthorization.value] as const,
      ([auth], [oldAuth]) => {
        authenticated.value = mediaAuthorization.value.auth
      },
      {flush: 'post'}
    )

    function initMedia(media: IMedia) {
      m = media
    }

    function onFullButtonClick() {
      eventbus.emit('onMenuFullButtonClick')
    }

    return {
      initMedia,
      fullButtonFocused,
      fullButtonNormal,
      onFullButtonClick,
      favButtonFocused,
      favButtonNormal,
      authenticated,
      mediaAuthorization
    }
  },
});

</script>

<style scoped>
.media-menu-root-css {
  width: 1740px;
  height: 184px;
  position: absolute;
  left: 1016px;
  top: 316px;
}

</style>
