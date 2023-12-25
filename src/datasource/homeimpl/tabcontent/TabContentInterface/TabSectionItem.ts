
export interface TabSectionItem {
  id:string,
  width: number
  height: number
  posX: number
  posY: number
  cellType: string | number
  poster?: string
  posterTitle: string
  posterTitleStyle?: string
  posterSubtitle?: string
  floatTitle?: string
  cornerContent?: string
  cornerColor?: string
  cornerGradient?: string
  focusImage?: string
  nonFocusImage?: string
  playLogoSwitch: string
  isCellPlayer?: boolean
  isCellPlayerList?: boolean
  playData?: Array<any>
  redirectType?:string
  action?:string
  innerArgs?:string
  [prop: string]: any
}
