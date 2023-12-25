import {IMedia} from "../../../datasource/media/IMedia";

export interface IAlbumDetail {

  initMedia(media: IMedia)

  showPlaceholderMediaInfo(value: boolean)

  show(value: boolean)

  scrollMediaListViewTo(position: number): void

  setMediaListViewSelected(position: number): void

  requestPlayerPlaceholderFocus(): void

  release(): void
}
