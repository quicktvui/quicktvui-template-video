<template>
  <!-- hasSider 和 hasHeader 只负责自动计算高度 插槽和属性需要同时使用 -->
  <ProListPage :hasSider="true" :hasHeader="true">
    <template #header>
      <Header />
    </template>

    <template #sider>
      <Sider ref="siderRef" @onTabChange="onTabChange" />
    </template>

    <template #content>
      <Content ref="contentRef" @onListItemClick="onListItemClick" />
    </template>
  </ProListPage>
</template>

<script lang="ts">

import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
import ProListPage from "src/components/ProListPage.vue";
import { QTPoster, QTWaterfallItem } from "@quicktvui/quicktvui3";
import Sider from "src/components/Sider.vue";
import Content from "src/components/Content.vue";
import Header from "src/components/Header.vue";

export default defineComponent({
  name: 'index',
  components: {
    ProListPage,
    Header,
    Sider,
    Content,
  },
  setup() {
    const contentRef = ref<InstanceType<typeof Content>>();

    const siderRef = ref<InstanceType<typeof Sider>>();

    const currentTabItem = ref();

    const currentFilter = ref<string[]>(["全部", "全部", "全部", "全部", "全部"]);

    const onESCreate = () => {
      siderRef.value?.initialize(initSideBarData());
    }

    const initSideBarData = () => {
      const titleArray = ["免费电影", "热血战争", "动作先锋", "犯罪现场", "浪漫爱情", "动画电影", "恐怖惊悚", "学习强国", "院线大片", "即将上映", "超前点播"];
      return titleArray.map(value => ({ value, label: value }));
    }

    const buildPosterDecorationItemList = () => {
      let imgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
      let itemList: Array<QTWaterfallItem> = []
      for (let i = 1; i <= 4 * 10; i++) {
        const poster: QTPoster = {
          _id: i === 1 ? "nextFocusRightSID-tag-1" : i.toString(),
          type: 10001,
          decoration: {
            left: 30,
            right: 30,
            top: 30,
            bottom: 30,
          },
          title: {
            text: [currentTabItem.value?.item.value, ...currentFilter.value].filter(e => ![void 0, "全部"].includes(e)).toString() + ':主标题',
            enable: true,
            style: {
              width: 335,
            }
          },
          focusTitle:{
            text: [currentTabItem.value?.item.value, ...currentFilter.value].filter(e => ![void 0, "全部"].includes(e)).toString() + ':主标题',
            enable: true,
            style: {
              width: 335,
            }
          },
          subTitle: {
            text: '副标题',
            enable: true,
            style: {
              width: 335,
            }
          },
          floatTitle: {
            text: '浮动标题',
            enable: true,
            style: {
              width: 335,
            },
            background: { colors: ['#e5000000', '#00000000'], orientation: 4 }
          },
          image: {
            src: imgURL,
            enable: true,
            style: {
              width: 335,
              height: 320
            }
          },
          style: {
            width: 335,
            height: 400,
          },
          corner: {
            text: '角标',
            enable: true,
            style: {
              width: 335,
              height: 30
            },
            background: {
              colors: ['#FE3824', '#F0051E'],
              cornerRadii4: [0, 8, 0, 8],
              orientation: 2
            }
          },
          titleStyle: {
            width: 335,
            height: 120,
            marginTop: 320 - 60,
          },
          titleFocusStyle: { width: 335, marginTop: 320 - 100 },
          focus: {
            enable: true,
            scale: 1.03,
          },
        }

        itemList.push(poster);
      }

      return itemList;
    }

    let timer: any = null
    const onTabChange = async (e) => {
      if (e.item.value === currentTabItem.value?.item.value) {
        return false;
      }

      !!timer && clearTimeout(timer);
      timer = setTimeout(() => {
        currentTabItem.value = e;
        contentRef.value?.gridViewRef?.setListData(buildPosterDecorationItemList())
        contentRef.value?.gridViewRef?.scrollToTop()
      }, 500);
    }

    const onListItemClick = (...rest) => {
      console.log(rest)
    }


    return {
      onESCreate,
      onTabChange,
      onListItemClick,
      contentRef,
      siderRef,
    }
  },
});

</script>
