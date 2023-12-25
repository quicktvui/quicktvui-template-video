import {IMedia} from "../../../datasource/media/IMedia";


export interface IMediaListView {
  initMedia(media: IMedia)

  scrollTo(position: number): void;

  setSelected(position: number): void;

  release(): void
}
