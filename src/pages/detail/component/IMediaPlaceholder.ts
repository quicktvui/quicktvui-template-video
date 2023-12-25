import {IMedia} from "../../../datasource/media/IMedia";

export interface IMediaPlaceholder {
  initMedia(media: IMedia): void

  showMediaInfo(show: boolean): void

  show(value: boolean): void

  requestFocus(): void
}
