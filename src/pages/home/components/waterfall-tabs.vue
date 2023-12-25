<template>
  <div class="waterfall-tab-root-css" :clipChildren="false" ref="waterfall_tab_root"
       :clipPadding="false">
      <waterfall-background ref="wTabBg"/>
      <div ref="buttonsHeaderDiv" name="buttonsHeaderDiv" class="buttons-header-css" :clipChildren="false"
        v-if="isShowTop" :blockFocusDirections="['left','right','up']">
        <slot name="buttonsHeader"/>
      </div>
      <!-- 背景播放及小窗播放组件 -->
      <bg-player
        class="bg_player"
        ref="bg_player" :clipChildren="false"
        :bgPlayerType="bgPlayerType"
        style="position: absolute;z-index: -1;">
      </bg-player>
      <qt-tabs
        ref="tabRef"
        :tabContentResumeDelay="0"
        :tabContentBlockFocusDirections="tabContentBlockFocusDirections"
        tabNavBarClass="qt-tabs-waterfall-tab-css"
        tabPageClass="qt-tabs-waterfall-css"
        :triggerTask="tabsTriggerTask"
        :outOfDateTime="60*60*1000"
        @onTabClick="onTabClick"
        @onTabChanged="onTabChanged"
        @onTabMoveToTopStart="onTabMoveToTopStart"
        @onTabMoveToTopEnd="onTabMoveToTopEnd"
        @onTabMoveToBottomStart="onTabMoveToBottomStart"
        @onTabMoveToBottomEnd="onTabMoveToBottomEnd"
        @onTabPageScrollToEnd="onTabPageScrollToEnd"
        @onTabPageScrollToStart="onTabPageScrollToStart"
        @onTabPageItemClick="onTabPageItemClick"
        @onTabPageItemFocused="onTabPageItemFocused"
        @onTabPageLoadData="onTabPageLoadData"
        @onTabPageScroll="onTabPageScroll"
        @onTabPageSectionAttached="onTabPageSectionAttached"
        class="qt-tabs-css">
        <template v-slot:tab-item>
          <tab-image-item :type="1"/>
          <tab-icon-item :type="2" cornerIconLeft/>
          <tab-text-icon-item :type="3" cornerIconLeft textIconLeft/>
        </template>
        <template v-slot:waterfall-item>
          <page-state-image-item :type="1"/>
          <page-no-frame-item :type="2"/>
          <page-place-holder-item :type="3"/>
          <item-cell-player :type="10008" ref="item_cell_player" :clipChildren="false"/>
        </template>
        <template #waterfall-list-item>
          <page-state-image-item :type="1"/>
          <page-no-frame-item :type="2"/>
          <page-place-holder-item :type="3"/>
        </template>
        <!--      <template v-slot:waterfall-vue-section>-->
        <!--        <page-mine/>-->
        <!--      </template>-->
      </qt-tabs>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ref,reactive,toRaw} from "vue";
import {IWaterfallBgManager} from "./IWaterfallBgManager";
import WaterfallBackground from "./waterfall-background.vue";
import {
  QTITab, QTTab,
  QTTabEventParams,
  QTTabItem,
  QTTabPageData, QTTabPageState,
  QTWaterfallItem
} from "@quicktvui/quicktvui3";
import {ESLogLevel, useESLog, useESToast} from "@extscreen/es3-core";
import {useLaunch} from "../../../utils/launch/useApi";
import {useTabDataSource} from "../../../datasource/useApi";
import BuildConfig from "../../../build/BuildConfig";
import {buildTabPage} from "../tab/tabs";
import TabImageItem from "../tab/tab-image-item.vue";
import PageStateImageItem from "../page/page-state-image-item.vue";
import TabIconItem from "../tab/tab-icon-item.vue";
import TabTextIconItem from "../tab/tab-text-icon-item.vue";
import PagePlaceHolderItem from "../page/pab-place-holder-item.vue";
import PageNoFrameItem from "../page/page-no-frame-item.vue";
import itemCellPlayer from "./item-cell-player.vue"
import bgPlayer from "./bg-player.vue"
import { Native } from "@extscreen/es3-vue";

const TAG = "WATERFALL-TABS"

export default defineComponent({
  name: "waterfall-tabs",
  components: {
    PageNoFrameItem,
    PagePlaceHolderItem,itemCellPlayer,bgPlayer,
    TabTextIconItem, TabIconItem, PageStateImageItem, TabImageItem, WaterfallBackground},
  props:{
    isShowTop:{
      type:Boolean,
      default:true
    }
  },
  setup(props, context) {
    let waterfall_tab_root = ref()
    const tabsTriggerTask = [
      {
        event: 'onContentScrollYGreater',
        target: 'buttonsHeaderDiv',
        function: 'changeVisibility',
        params: ['invisible'],
      },
      {
        event: 'onContentScrollYLesser',
        target: 'buttonsHeaderDiv',
        function: 'changeVisibility',
        params: ['visible'],
      },
    ]
    const log = useESLog()
    const launch = useLaunch()
    const toast = useESToast()
    const tabDataSource = useTabDataSource()
    const tabRef = ref<QTITab>()
    //播放背景组件相关
    const bg_player = ref()
    let bgPlayerType = ref('')
    let recordPlayerData = reactive({
      pageIndex: -1,
      itemIndex:-1,
      data: {} as QTWaterfallItem,
    })
    //背景图
    const wTabBg = ref<IWaterfallBgManager>()
    //tab
    const tabContentBlockFocusDirections = ref(['down', 'left', 'right', 'top'])
    let tabItemList: Array<QTTabItem>
    //
    function onESCreate(params) {
     getTabList()
      // wTabBg.value?.setImg("http://qcloudimg.a311.ottcn.com/data_center/files/2023/12/08/62fc822a-eef4-4bfe-81b7-b1f91da9feb5..jpg","",true,false)
    }

    function getTabList() {
      tabDataSource.getTabList().then((tab: QTTab) => {
          tabItemList = tab.itemList
          tabRef.value?.initTab(tab)
          tabRef.value?.initPage(buildTabPage())
        },
        error => {
          toast.showToast('加载数据失败，稍后重试！')
        })
    }
    function onESStart() {

    }

    function onESResume() {
      bg_player.value?.reset()
    }

    function onESStop() {
      bg_player.value?.reset()
    }

    function onESPause() {
      bg_player.value?.reset()
    }

    function onESDestroy() {
      bg_player.value?.reset()
    }

    function onTabPageLoadData(pageIndex: number, useDiff: boolean): void {
      if (tabItemList && pageIndex >= 0 && pageIndex < tabItemList.length) {
        const tab = tabItemList[pageIndex]
        const pageNo = getTabPagePageNo(pageIndex);
        if(tab._id == '0' || tab._id) getTabContent(tab._id, pageIndex, pageNo + 1)
      }
    }
    function getTabPagePageNo(tabPageIndex: number): number {
      const tab: QTTabItem = tabItemList[tabPageIndex]
      return tab.pageNo ?? 0
    }
    function getTabContent(tabId: string, tabPageIndex: number, pageNo: number) {
      tabDataSource.getTabContent(tabId, pageNo, BuildConfig.tabContentPageSize)
        .then((tabPage: QTTabPageData) => {
            if (tabPage.data.length > 0) {
              setTabPagePageNo(tabPageIndex, pageNo)
              if (pageNo <= 1) {
                if (log.isLoggable(ESLogLevel.DEBUG)) {
                  log.d(TAG, '---------getTabContent-----setPageData--->>>>' +
                    ' tabPageIndex:' + tabPageIndex +
                    ' pageNo:' + pageNo +
                    ' tabPage:', tabPage)
                }
                tabRef.value?.setPageData(tabPageIndex, tabPage)
                tabRef.value?.setPageState(tabPageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
              } else {
                // if (log.isLoggable(ESLogLevel.DEBUG)) {
                //   log.d(TAG, '---------getTabContent-----addPageData--->>>>' +
                //     ' tabPageIndex:' + tabPageIndex +
                //     ' pageNo:' + pageNo +
                //     ' tabPage:', tabPage)
                // }
                // tabRef.value?.addPageData(tabPageIndex, tabPage, 0)
              }
            } else {
              // if (log.isLoggable(ESLogLevel.DEBUG)) {
              //   log.d(TAG, '---------getTabContent-----addPageData--->>>>' +
              //     ' tabPageIndex:' + tabPageIndex +
              //     ' pageNo:' + pageNo +
              //     ' tabPage:', tabPage)
              // }
              // tabRef.value?.addPageData(tabPageIndex, buildTabPageEndData(), 0)
              tabRef.value?.setPageState(tabPageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
            }
          },
          error => {
            toast.showToast('加载数据失败，稍后重试！')
          })
    }

    function setTabPagePageNo(tabPageIndex: number, pageNo: number) {
      const tab: QTTabItem = tabItemList[tabPageIndex]
      tab.pageNo = pageNo
    }

    function onTabMoveToTopStart(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToTopStart----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
    }
    function onTabMoveToTopEnd(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToTopEnd----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
    }

    function onTabMoveToBottomStart(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToBottomStart----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
    }

    function onTabMoveToBottomEnd(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToBottomEnd----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
    }
    function onTabPageScrollToEnd(pageIndex: number) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabPageScrollToEnd----------->>>',
          ' pageIndex:' + pageIndex
        )
      }
    }

    function onTabPageScrollToStart(pageIndex: number) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabPageScrollToStart----------->>>',
          ' pageIndex:' + pageIndex
        )
      }
    }

    // waterfall item 加载之前回调  处理小窗及背景播放逻辑
    let delayOnTabPageSectionAttachedTimer: any = -1
    let delayDealwithplayerTimer: any = -1
    let currentSectionAttachedIndex = ref(-1)
    function onTabPageSectionAttached(currentTabPageIndex: number, sectionList:any){
      if(sectionList.length < 1) return
      if(delayOnTabPageSectionAttachedTimer) clearTimeout(delayOnTabPageSectionAttachedTimer)
      delayOnTabPageSectionAttachedTimer = setTimeout(() => {
        const bg = tabDataSource.getTabBg(tabItemList[currentTabPageIndex]._id)
        bg_player.value.setNextImage(bg)
        if(currentSectionAttachedIndex.value != currentTabPageIndex) {
          currentSectionAttachedIndex.value = currentTabPageIndex
          let sectionData = sectionList[0]
          if(sectionData && sectionData.itemList){
            recordPlayerData.pageIndex = -1
            recordPlayerData.itemIndex = -1
            recordPlayerData.data = {} as QTWaterfallItem
            let flag = ''
            let width:any
            let height:any
            for (let index = 0; index < sectionData.itemList.length; index++) {
              const element = sectionData.itemList[index];
              if(element.isCellPlayer){
                if(element.isCellPlayerList) flag = 'isCellPlayerList'
                else flag = 'isCellPlayer'
                // if(element.isBgPlayer) flag = 'isBgPlayer'
                element.childSID = "bg-player"
                width = element.style.width
                height = element.style.height
                recordPlayerData.pageIndex = currentTabPageIndex
                recordPlayerData.itemIndex = index
                recordPlayerData.data = element
              }else if(element.isBgPlayer){
                flag = 'isBgPlayer'
                element.childSID = ""
                width = element.style.width
                height = element.style.height
                recordPlayerData.pageIndex = currentTabPageIndex
                recordPlayerData.itemIndex = index
                recordPlayerData.data = element
                break
              }
            }
            bgPlayerType.value = ''
            bg_player.value.stop()
            // bg_player.value.bgPlayerOpacity = 0
            if(flag == 'isCellPlayer') {
              Native.callUIFunction(waterfall_tab_root.value,'dispatchFunctionBySid', [recordPlayerData.data.sid,'setChildSID',['bg-player']]);
              if(delayDealwithplayerTimer) clearTimeout(delayDealwithplayerTimer)
              delayDealwithplayerTimer =setTimeout(() => {
                bgPlayerType.value = 'isCellPlayer'
                setTimeout(() => {
                  bg_player.value.setSize(width,height,width,height)
                  bg_player.value.initComponent(toRaw(recordPlayerData.data.playData))
                },400)
              },200)
            }else if(flag == 'isCellPlayerList') {
              Native.callUIFunction(waterfall_tab_root.value,'dispatchFunctionBySid', [recordPlayerData.data.sid,'setChildSID',['bg-player']]);
              if(delayDealwithplayerTimer) clearTimeout(delayDealwithplayerTimer)
              delayDealwithplayerTimer =setTimeout(() => {
                bgPlayerType.value = 'isCellPlayerList'
                setTimeout(() => {
                  bg_player.value.setSize(width,height,860,height)
                  bg_player.value.initComponent(toRaw(recordPlayerData.data.playData))
                },400)
              },200)
            }else if(flag == 'isBgPlayer') {
              Native.callUIFunction(waterfall_tab_root.value,'dispatchFunctionBySid', ['bg_player_replace_child_sid','setChildSID',['bg-player']]);
              if(delayDealwithplayerTimer) clearTimeout(delayDealwithplayerTimer)
              delayDealwithplayerTimer = setTimeout(() => {
                bgPlayerType.value = 'isBgPlayer'
                setTimeout(() => {
                  bg_player.value.setSize(1920,1080,1920,1080)
                  bg_player.value.initComponent(toRaw(recordPlayerData.data.item.playData))
                },400)
              },200)
            }
          }
        }
      },200)
    }

    function onTabPageItemClick(pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---------onTabPageItemClick-------->>>>' +
          " pageIndex: " + pageIndex +
          " sectionIndex: " + sectionIndex +
          " itemIndex: " + itemIndex +
          " item: ", item
        )
      }
      launch.launch(item)
    }
    function onTabPageItemFocused(pageIndex: number, sectionIndex: number, itemIndex: number, isFocused: boolean, item: QTWaterfallItem) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---------onTabPageItemFocused-------->>>>', sectionIndex, '---->>>', itemIndex)
      }
      if(bgPlayerType.value == 'isBgPlayer' && isFocused &&
        recordPlayerData.data.item.playData[0].url != item.item.playData[0].url){
        clearTimeout(delayDealwithplayerTimer)
        bg_player.value.setNextImage(item.item.playData[0].cover)
        bg_player.value.stop()
        delayDealwithplayerTimer = setTimeout(() => {
          recordPlayerData.pageIndex = pageIndex
          recordPlayerData.itemIndex = itemIndex
          recordPlayerData.data = item
          bg_player.value.play(item.item.playData[0].url)
        },200)
      }
    }

    function onTabPageScroll(offsetX: number, scrollY: number) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---------onTabPageScroll-------->>>>', offsetX, '---->>>', scrollY)
      }
      // toast.showLongToast(scrollY + 'onTabPageScrollonTabPageScrollonTabPageScrollonTabPageScroll')
      console.log(offsetX,scrollY,'onTabPageScrollonTabPageScrollonTabPageScrollonTabPageScroll')
      if(scrollY > 10) {
        if(bgPlayerType.value == 'isCellPlayer' || bgPlayerType.value == 'isCellPlayerList'){
          bg_player.value.setCellNextImage()
        }
      }
      if(scrollY == 0) {
        bg_player.value.setCellNextColor()
      }
    }
    function onTabChanged(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabChanged----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
    }
    function onTabClick(item:QTTabItem){

    }

    return {
      waterfall_tab_root,
      onESCreate,
      onESStart,
      onESStop,
      onESResume,
      onESPause,
      onESDestroy,
      tabsTriggerTask,
      wTabBg,
      tabRef,
      bg_player,bgPlayerType,
      tabContentBlockFocusDirections,

      onTabPageLoadData,

      onTabMoveToTopStart,
      onTabMoveToTopEnd,
      onTabMoveToBottomStart,
      onTabMoveToBottomEnd,

      onTabPageScrollToEnd,
      onTabPageScrollToStart,

      onTabPageItemClick,
      onTabPageItemFocused,
      onTabPageScroll,
      onTabChanged,
      onTabClick,
      onTabPageSectionAttached
    }
  }
})
</script>

<style src="./../css/home.css"></style>
