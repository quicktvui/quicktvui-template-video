import {ESApp} from "@extscreen/es3-vue";
import {QTTab, QTTabPageData} from "@quicktvui/quicktvui3";

export interface ITabDataSource {
    install(app: ESApp): void

    init(...params: any[]): Promise<any>

    getTabList(): Promise<QTTab>

    getTabContent(tabId: string, pageNo: number, pageSize: number): Promise<QTTabPageData>

    getTabBg(tabId):string
}

