<template>
  <div id="root">
    <es-router-view/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useES, useESDevelop, useESDevice, useESLog, useESRuntime} from "@extscreen/es3-core";
import {ESPlayerLogLevel, useESPlayer, useESPlayerLog} from "@extscreen/es3-player";
import {useRequestManager} from "./utils/request/useApi";
import {useMediaDataSource, useTabDataSource} from "./datasource/useApi";
import {useUserManager} from "./utils/user/useApi";
import BuildConfig from "./build/BuildConfig";
import {useLaunch} from "./utils/launch/useApi";
import {useESNativeRouter, useESRouter} from "@extscreen/es3-router";

export default defineComponent({
  name: "App",
  setup() {

    const log = useESLog()
    const es = useES()
    const develop = useESDevelop()
    const device = useESDevice()
    const runtime = useESRuntime()
    const playerManager = useESPlayer()
    const router = useESRouter()
    const nativeRouter = useESNativeRouter()
    const launch = useLaunch()
    const playerLog = useESPlayerLog()

    //
    const request = useRequestManager()
    const tabDataSource = useTabDataSource()
    const mediaDataSource = useMediaDataSource()
    const userManager = useUserManager()

    function onESCreate(app, params) {
      initESLog()
      return Promise.resolve()
        .then(() => request.init(es, develop, device, runtime, log))
        .then(() => tabDataSource.init(request))
        .then(() => mediaDataSource.init(request))
        .then(() => userManager.init())
        .then(() => launch.init(log, router, nativeRouter))
        .then(() => playerManager.init({
          debug: true,
          display: {
            screenWidth: device.getScreenWidth(),
            screenHeight: device.getScreenHeight(),
          },
          device: {
            deviceType: runtime.getRuntimeDeviceType() ?? ''
          }
        }))
    }

    function initESLog() {
      if (BuildConfig.debug) {
        log.setMinimumLoggingLevel(ESLogLevel.DEBUG)
        playerLog.setMinimumLoggingLevel(ESPlayerLogLevel.DEBUG)
      } else {
        log.setMinimumLoggingLevel(ESLogLevel.WARN)
        playerLog.setMinimumLoggingLevel(ESPlayerLogLevel.WARN)
      }
    }

    return {
      onESCreate
    }
  }
});
</script>

<style scoped>
#root {
  width: 1920px;
  height: 1080px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
