//
import {TabSectionItem} from "./TabSectionItem";

export interface TabContentSection {

    id: string
    plateName: string
    height: number
    blankBottom: number,
    plateDetails: Array<TabSectionItem>
    showPlateName: string
    posterTitleStyle: string
    plateType: string
    contentType:string
}
