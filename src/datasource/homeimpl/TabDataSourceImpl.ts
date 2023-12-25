import {ESApp} from "@extscreen/es3-vue";
import {RequestManager} from "../../utils/request/RequestManager";
import {TabDataSourceKey} from "../useApi";
import {QTTab, QTTabPageData} from "@quicktvui/quicktvui3";
import {ITabDataSource} from "./ITabDataSource";
import tabMockJson from "./../mock/home_tab.ts"
import tabPage0MockJson from "./../mock/home_page0.ts"
import tabPage1MockJson from "./../mock/home_page1.ts"
import tabPage2MockJson from "./../mock/home_page2.ts"
import tabPage3MockJson from "./../mock/home_page3.ts"
import {Tab} from "./tab/TabInterface/Tab";
import {
  buildTransferTabContentAdapter,
} from "./tabcontent/TabContentTransferAdapter";
import {buildTransferTabAdapter, getTabBackground} from "./tab/TabTransferAdapter";

export function createTabDataSource(): ITabDataSource {

    let requestManager: RequestManager

    function init(...params: any[]): Promise<any> {
        requestManager = params[0]
        return Promise.resolve()
    }

    function getTabList(): Promise<QTTab> {
      //此处可更换接口请求数据
      const tabs:Array<Tab> = tabMockJson as Array<Tab>
      return Promise.resolve(buildTransferTabAdapter(tabs))

        // return requestManager.post('url', {})
        //   .then((tabList: Array<Tab>) => {
        //     return buildTransferAdapter(tabList)
        // })
    }

    function getTabContent(tabId: string, pageNo: number, pageSize: number): Promise<QTTabPageData> {
      //此处可更换接口请求数据
      const name:Array<any> = [tabPage0MockJson,tabPage1MockJson,tabPage2MockJson,tabPage3MockJson]
      const index = Number(tabId)
      return Promise.resolve(buildTransferTabContentAdapter(name[index],pageNo == 1))

      // return requestManager.post('/v3/zero/arrange/layoutByMenuCode', {
      //       'data': tabId,
      //       'param': {
      //           'isSupportPage': 1,
      //           "pageNo": pageNo,
      //           "pageSize": pageSize,
      //       }
      //   }).then((tabContent: TabContent) => {
      //       return buildTabContent(tabContent, pageNo == 1)
      //   })
    }
    function getTabBg(tabId):string{
      return getTabBackground(tabId)
    }

    return {
        install: function (app: ESApp) {
            const instance = this
            app.provide(TabDataSourceKey, instance)
        },
        init,
        getTabList,
        getTabContent,
        getTabBg,
    }
}


