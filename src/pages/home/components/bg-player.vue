<template>
  <qt-view class="bg_player" :clipChildren="false">
    <replace-child
      v-if="bgPlayerType == 'isBgPlayer'"
      :focusable="false" :clipChildren="false"
      childSID="bg-player"
      @onChildChanged="onChildChanged"
      ref="bg_player_replace_child"
      class="bg_player_replace_child"
      sid="bg_player_replace_child_sid">
    </replace-child>
    <qt-view sid="bg-player" class="bg_player_box"
     :opacity="bgPlayerOpacity" :clipChildren="false"
      :style="{width:playerBoxWidth + 'px',height:playerBoxHeight + 'px'}">
      <qt-view :style="{width:playerWidth + 'px',height:playerHeight + 'px'}" :focusable="true" 
        class="playerBox" :clipChildren="false" @click="onClickCellItem">
        <es-player-manager :clipChildren="false"
          ref="playerManagerRef"
          class="player-manager"
          :focusable="false" 
          :initPlayerWindowType="2"
          :playerList="playerList"
          @onPlayerPlaying="onVideoPlayerPlaying"
          @onPlayerCompleted="onVideoPlayerCompleted"
          @onPlayerInitialized="onPlayerInitialized"
        />
        <img-transition ref="itemCellBgImgRef" class="item_cell_bg_img" :fullQuality="true" :transitionTime="400" :clipChildren="false"
          v-if="bgPlayerType == 'isCellPlayer' || bgPlayerType == 'isCellPlayerList'" :focusable="false" 
          :style="{width:playerWidth + 'px',height:playerHeight + 'px'}"/>
      </qt-view>
      <!-- 小窗播放列表 -->
      <qt-view class="item_cell_list_front"  v-if="bgPlayerType == 'isCellPlayerList'"
        :style="{width:playerListWidth + 'px',height:playerListHeight + 'px'}" :clipChildren="false">
        <qt-list-view class="list_view" ref="listViewRef" :clipChildren="false" padding="0,0,0,1"
          :style="{width:playerListWidth + 'px',height:playerListHeight + 'px'}"
          @item-click="onItemClick"  @item-focused="onItemFocus">
          <qt-view :type="10001" name="iclf_item" class="iclf_item" :focusable="true" :enableFocusBorder="true"
            :style="{width: playerListWidth + 'px'}"
            :clipChildren="false" eventClick eventFocus :focusScale="1">
            <qt-view :duplicateParentState="true" class="iclf_item_playing" :clipChildren="false" 
              :style="{width: playerListWidth + 'px'}" >
              <qt-view class="playMark" :focusable="false" showIf="${isPlaying==true}">
                <play-mark :style="{width:'20px',height:'20px'}" :markColor="'#FF4E46'" :gap="-1" style="margin-left: 16px;" :focusable="false"/>
              </qt-view>
              <!-- <img :src="cell_list_focus_img" alt="" :focusable="false" showIf="${isPlaying==true}" 
                :style="{width: playerListWidth + 'px'}" class="iclf_item_playing_bg"> -->
              <qt-text :focusable="false" :ellipsizeMode="2" :fontSize="26" gravity="left|center" :lines="2" :maxLines="2" 
                :duplicateParentState="true"  :showOnState="['focused']"
                class="iclf_item_text_focused"  text="${title}" :paddingRect="[0,0,0,0]"/>
              <qt-text :focusable="false" :ellipsizeMode="2" :fontSize="26" gravity="left|center" :lines="2" :maxLines="2" 
                :duplicateParentState="true"  :showOnState="['selected']"
                class="iclf_item_text_selected"  text="${title}" :paddingRect="[0,0,0,0]"/>
              <qt-text :focusable="false" :ellipsizeMode="2" :fontSize="26" gravity="left|center" :lines="2" :maxLines="2" 
                :duplicateParentState="true" :showOnState="['normal']"
                class="iclf_item_text_normal"  text="${title}" :paddingRect="[0,0,0,0]"/>
            </qt-view>
          </qt-view>
        </qt-list-view>
      </qt-view>
    </qt-view>
    <img-transition ref="bgRef" class="bg-img" :fullQuality="true" :transitionTime="400"/>
  </qt-view>
</template>

<script lang="ts">
import { ref, defineComponent, markRaw,nextTick } from "vue";
import { QTIListView,QTListViewItem } from "@quicktvui/quicktvui3";
import {ESMediaSource, ESMediaSourceList,ESPlayerPosition,ESPlayerPlayMode,useESPlayerDecodeManager,ESPlayerDecode} from "@extscreen/es3-player";
import { ESIPlayerManager, ESMediaItemList,ESMediaItem, ESPlayerManager} from "@extscreen/es3-player-manager";
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import { ESITransitionImage, } from "@extscreen/es3-component";
import {ESLogLevel, useESLog, useESToast} from "@extscreen/es3-core";

export default defineComponent({
  name: 'waterfall-player',
  components: {
    'es-player-manager': ESPlayerManager,
  },
  props:{
    bgPlayerType:{
      type: String,
      default: ''
    }
  },
  setup(props,ctx) {
    const decode = useESPlayerDecodeManager()
    let playerBoxWidth = ref<number>(1920)
    let playerBoxHeight = ref<number>(1080)
    let playerWidth = ref<number>(860)
    let playerHeight = ref<number>(484)
    let playerListWidth = ref<number>(0)
    let playerListHeight = ref<number>(0)
    let bgPlayerOpacity = ref(0)
    const listViewRef = ref<QTIListView>()
    let listDataRec: Array<QTListViewItem> = [];
    const playerManagerRef = ref<ESIPlayerManager>()
    const playerList = ref([markRaw(ESVideoPlayer)])
    const bgRef = ref<ESITransitionImage>();
    const itemCellBgImgRef = ref<ESITransitionImage>();
    let bg_player_replace_child = ref()
    let playerIsInitialized = ref(false)
    let delayShowTimer:any = -1
    let delayShowItemCellBgImgTimer:any = -1
    let delayUpdateItenTimer:any = -1
    let cell_list_focus_img = require('../../../assets/cell-list-focus-img.gif').default
    let recordPlayerList: Array<any> = []
    const toast = useESToast()
    const initComponent = (playerListData: any) => {
      bgPlayerOpacity.value = 0
      setNextColor()
      recordPlayerList=[]
      if(delayShowTimer) clearTimeout(delayShowTimer)
      if(delayShowItemCellBgImgTimer) clearTimeout(delayShowItemCellBgImgTimer)
      let item0 = playerListData[0]
      recordPlayerList = JSON.parse(JSON.stringify(playerListData))
      if(!playerIsInitialized.value) initPlayer();
      console.log(props.bgPlayerType,item0,'888888888888888888888888889999999999666666666')
      if(props.bgPlayerType == 'isCellPlayer'){
        delayShowItemCellBgImgTimer = setTimeout(() => {
          setCellNextImage(item0.cover)
        },300)
        play(item0.url);
        setPlayMediaListMode(0)
        playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
      }else if(props.bgPlayerType == 'isBgPlayer'){
        delayShowItemCellBgImgTimer = setTimeout(() => {
          setNextImage(item0.cover)
        },300)
        play(item0.url);
        setPlayMediaListMode(3)
        playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
      }else if(props.bgPlayerType == 'isCellPlayerList'){
        delayShowItemCellBgImgTimer = setTimeout(() => {
          setCellNextImage(item0.cover)
        },300)
        play(item0.url);
        playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
        setPlayMediaListMode(0)
        if(!playerListData) return
        let arr: Array<QTListViewItem> = []
        for (let i = 0; i < playerListData.length; i++) {
          let el = playerListData[i]
          el.type = 10001;
          el.decoration = {};
          el.isPlaying = i == 0 ? true : false;
          arr.push(el)
        }
        nextTick(() => {
          listDataRec = listViewRef.value!.init(arr)
          setTimeout(() => {
            listViewRef.value?.setItemSelected(0,true)
          }, 200);
        })
      }
      delayShowTimer = setTimeout(() => {
        bgPlayerOpacity.value = 1
      },800)
    }
    let  loopPlayListTimer: any = -1
    const startInterval = (index: number) => {
      if(loopPlayListTimer) clearTimeout(loopPlayListTimer)
      loopPlayListTimer = setTimeout(() => {
        dealwithItemPlay(recordPlayerList[index],index)
      },5000)
    }
    const reset = () => {
      clearInterval(loopPlayListTimer)
      stop()
      release()
    }
    const setSize = (width:number,height:number,pWidth:number,pHeight:number) => {
      playerBoxWidth.value = width
      playerBoxHeight.value = height
      playerListWidth.value = width - pWidth
      playerListHeight.value = height
      playerWidth.value = pWidth
      playerHeight.value = pHeight
      // playerManagerRef.value?.setSize(playerWidth,playerHeight)
    }
    // cell-img-transition api
    const setCellNextImage = (backgroundImage: any) => {
      if(backgroundImage) itemCellBgImgRef.value?.setNextImage(backgroundImage);
      else itemCellBgImgRef.value?.setNextImage(recordPlayerList[currentPlayIndex.value].cover);
    }
    const setCellNextColor = () => itemCellBgImgRef.value?.setNextColor(0)
    // img-transition api
    const setNextImage = (backgroundImage: any) => bgRef.value?.setNextImage(backgroundImage);
    const setNextColor = () => bgRef.value?.setNextColor(0)
    //player api
    const initPlayer = () => playerManagerRef.value?.initialize()
    const play = (url:string) => {
      let mediaItem_0: ESMediaItem = {
        mediaSourceList: {
          index: 0,
          list: [{
            // uri: 'http://qcloudcdn.a311.ottcn.com/data_center/videos/SHORT/DEFAULT/2023/08/25/7d3623ae-c002-4929-b5a2-fe10bca06bfc.mp4'
            uri: url
          }]
        },
      }
      let playList: ESMediaItemList = {
        index: 0,
        list: [mediaItem_0]
      }
      playerManagerRef.value?.playMediaList(playList);
    }
    const release = () => playerManagerRef.value?.release()
    const stop = () => playerManagerRef.value?.stop()
    const pause = () => playerManagerRef.value?.pause()
    const resume = () => playerManagerRef.value?.resume()
    const setPlayMediaListMode = (playMode: ESPlayerPlayMode ) => playerManagerRef.value?.setPlayMediaListMode(playMode)
    let playeringTimer: any
    const onVideoPlayerPlaying = () => {
      clearTimeout(playeringTimer)
      playeringTimer = setTimeout(() => {
        setNextColor()
        setCellNextColor()
      },400)
    }
    let currentPlayIndex = ref(0)
    const onClickCellItem = () => {
      
    }
    const onItemClick = (e) => {
      console.log(e,'8888886898797456789465498794654687946')
    }
    const onItemFocus = (e) => {
      if(e.hasFocus && e.position != currentPlayIndex.value){
        dealwithItemPlay(e.item,e.position)
      }
    }
    const dealwithItemPlay = (item: any,nextIndex:any) => {
      listViewRef.value?.clearPostTask()
      if(delayUpdateItenTimer) clearTimeout(delayUpdateItenTimer)
      listViewRef.value?.setItemSelected(nextIndex,true)
      setCellNextImage(item.cover)
      delayUpdateItenTimer = setTimeout(() => {
        listDataRec[currentPlayIndex.value].isPlaying = false
        currentPlayIndex.value = nextIndex
        stop()
        setTimeout(() => {
          listDataRec[nextIndex].isPlaying = true
          play(item.url)
          playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
        },200)
      },200)
    }
    const onPlayerInitialized = () => {
      // decode.setDecode(ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE)
      playerIsInitialized.value = true
    }
    const onVideoPlayerCompleted = () => {
      if(props.bgPlayerType == 'isCellPlayerList'){
        clearInterval(loopPlayListTimer)
        if(currentPlayIndex.value + 1 >= recordPlayerList.length) dealwithItemPlay(recordPlayerList[0],0)
        else dealwithItemPlay(recordPlayerList[currentPlayIndex.value + 1],currentPlayIndex.value + 1)
      }
    }
    const onChildChanged = (e) => {
      // console.log(e,'onChildChangedonChildChangedonChildChangedonChildChangedonChildChanged')
    }
    return {
      playerList,bg_player_replace_child,bgPlayerOpacity,itemCellBgImgRef,reset,
      playerManagerRef,release,stop,pause,resume,initPlayer,play,
      playerBoxWidth,playerBoxHeight,playerListWidth,playerListHeight,
      playerWidth,playerHeight,playerIsInitialized,
      listViewRef,onItemClick,currentPlayIndex,onItemFocus,onClickCellItem,
      bgRef,setNextImage,setNextColor,cell_list_focus_img,
      setCellNextImage,setCellNextColor,
      onVideoPlayerPlaying,onVideoPlayerCompleted,onPlayerInitialized,
      initComponent,setSize,onChildChanged
    };
  },
});
</script>

<style>
.bg_player{width: 1920px;height: 1080px;background-color: transparent;
 flex-direction: row;justify-content: center;align-items: center;}
.bg_player_replace_child{width: 1920px;height: 1080px;background-color: rgba(0, 0, 0, 0.1);position: absolute;}
.bg_player_box{width: 1920px;height: 1080px;background-color: transparent;position: absolute;border-radius: 8px;top: 0;left: 0;}
.playerBox{
  background-color: rgba(0, 0, 0, 0.1);
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 0;
}
.player-manager{
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  border-radius: 8px;
}
.item_cell_bg_img{
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 8px;
}
.item_cell_list_front{background-color: rgba(255,255,255,0.1);position: absolute;right: 0;top: 0;}
.iclf_item{height: 96px;background-color: transparent;
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 0;
  focus-background-color: #fff;
}

.iclf_item_playing{position: absolute;height: 96px;border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.1);}
.iclf_item_playing_bg{
  position: absolute;height: 96px;
}
.iclf_item .playMark{width: 45px;height: 30px;background-color: transparent;position: absolute;left: 0;top: 38px;}


.iclf_item_noPlay{position: absolute;}
.iclf_item_text_focused{color: #000;position: absolute;height: 96px;width: 350px;left: 65px;}
.iclf_item_text_selected{color: #FF4E46;position: absolute;height: 96px;width: 350px;left: 65px;}
.iclf_item_text_normal{color: #FFFFFF;position: absolute;height: 96px;width: 350px;left: 65px;}


.iclf_item_text{height: 96px;color: #fff;width: 400px;margin-left: 50px;}
.bg-img{width: 1920px;height: 1080px;position: absolute;}
</style>
