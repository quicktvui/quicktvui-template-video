<template>
  <qt-view class="header" ref="headerRef">
    <div class="left-box">
      <qt-image :src="logo" class="qt-image" />

      <qt-button round text="左侧按钮1" size="mini" class="text-button-class"></qt-button>
      <qt-button round text="左侧按钮2" size="mini" class="text-button-class"></qt-button>
      <qt-button round text="左侧按钮3" size="mini" class="text-button-class"></qt-button>
    </div>

    <div class="right-box">
      <qt-button round text="右侧按钮1" size="mini" class="text-button-class"></qt-button>
      <qt-button round text="右侧按钮2" size="mini" class="text-button-class"></qt-button>
    </div>
  </qt-view>
</template>
<script lang="ts" setup>
import { QTIView } from '@quicktvui/quicktvui3';
import { ref } from 'vue';
import logo from "../assets/logo.png"

const headerRef = ref<QTIView>();

</script>
<style scoped>
.header {
  width: 1920px;
  height: 100px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-style: solid;
  border-color: #000;
  border-bottom-width: 1px;
}


.header .left-box,
.header .right-box {
  display: flex;
  flex-direction: row;
}


.header .left-box {
  width: 610px;
  justify-content: space-between;
  margin-left: 20px;
}

.header .right-box {
  width: 350px;
  justify-content: space-between;
  margin-right: 20px;
}

.header .left-box .qt-image {
  width: 80px;
  height: 80px;
}

/* p {
  width: 1920px;
  text-align: center;
  font-size: 40px;
  color: black;
} */
</style>
