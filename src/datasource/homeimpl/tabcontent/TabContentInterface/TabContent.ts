//
import {TabContentSection} from "./TabContentSection";

export interface TabContent {
    id: string
    tabId: string
    backgroundImage: string
    backgroundColor: string
    plates: Array<TabContentSection>
    plateCount: number
}
