import {IMedia} from "../../../datasource/media/IMedia";
import {ESKeyEvent} from "@extscreen/es3-core";
import {ESPlayerWindowType} from "@extscreen/es3-player";

export interface IMediaPlayer {

  play(media: IMedia)

  addMediaItemList(page: number, mediaList: Array<IMedia>)

  playMediaItemById(id: string)

  playMediaItemByIndex(index: number)

  getPlayingMediaIndex(): number

  setFloatWindow()

  setSmallWindow()

  getWindowType(): ESPlayerWindowType

  stop()

  release()

  resume()

  setFullWindow(): void

  onKeyDown(keyEvent: ESKeyEvent): boolean

  onKeyUp(keyEvent: ESKeyEvent): boolean

  onBackPressed(): boolean
}
