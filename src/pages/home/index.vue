<template>
  <div class="home-root-css" ref="root">
    <waterfall-tabs ref="waterfallTabs" >
      <template #buttonsHeader>
        <top-btns-view :logo-right="true">
<!--          <template #btnItem>-->
<!--            <img-text-btn-view-->
<!--              text="搜索"-->
<!--              :focusable="true"-->
<!--              :icon-left="true"-->
<!--              style="width: 145px;height: 60px;margin-left: 10px;margin-right: 10px"-->
<!--              name="top_search_btn"-->
<!--              ref="top_search_btn"-->
<!--              icon="ic_top_search.png"-->
<!--              focus-icon="ic_top_search_focus.png"/>-->
<!--          </template>-->

        </top-btns-view>
      </template>
    </waterfall-tabs>





  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";
import TopBtnsView from "../../components/top-btns-view.vue";
import WaterfallTabs from "./components/waterfall-tabs.vue";
import ImgTextBtnView from "../../components/img-text-btn-view.vue";

export default defineComponent({
  name: "home",
  components: {
    'waterfall-tabs':WaterfallTabs,
    'img-text-btn-view':ImgTextBtnView,
    'top-btns-view':TopBtnsView
  },
  props:{
    height:{
      type:String,
      default: "80px"
    }
  },
  setup(props, context) {
    const waterfallTabs = ref()
    function onESCreate(params) {
      waterfallTabs.value?.onESCreate(params)
    }

    function onESStart() {

    }

    function onESResume() {
      waterfallTabs.value?.onESResume()
    }

    function onESStop() {
      waterfallTabs.value?.onESStop()
    }

    function onESDestroy() {
      waterfallTabs.value?.onESDestroy()
    }

    return {
      waterfallTabs,
      onESCreate,
      onESStart,
      onESResume,
      onESStop,
      onESDestroy,
    }
  }
})
</script>

<style src="./css/home.css">

</style>
