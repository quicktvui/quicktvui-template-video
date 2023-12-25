import {ESApp} from "@extscreen/es3-vue";
import {RequestManager} from "../../../utils/request/RequestManager";
import {MediaDataSourceKey} from "../../useApi";
import {IMediaDataSource} from "../IMediaDataSource";
import {IMedia} from "../IMedia";
import {buildMedia, buildMediaList} from "./MediaDataAdapter";
import {Media} from "./Media";
import {IMediaUrl} from "../IMediaUrl";
import {IMediaAuthorization} from "../IMediaAuthorization";

export function createMediaDataSource(): IMediaDataSource {

  let requestManager: RequestManager

  function init(...params: any[]): Promise<any> {
    requestManager = params[0]
    return Promise.resolve()
  }

  function getMediaDetail(mediaId: string): Promise<IMedia> {
    return requestManager.post(`/v2/zero/media/assetlong/meta/${mediaId}`, {})
      .then((media: Media) => buildMedia(media))
  }

  function getMediaRecommendation(mediaId: string): Promise<Array<IMedia>> {
    return requestManager.post(`/v1/zero/media/assetlong/recommend/${mediaId}`, {})
      .then((mediaList: Array<Media>) => buildMediaList(mediaList))
  }

  function getMediaItemList(mediaItemListId: string, pageNo: number, pageSize: number): Promise<Array<IMedia>> {
    return requestManager.post(`/v2/zero/media/assetlong/episodeList/${mediaItemListId}`, {
      'action': 'detail',
      'param': {
        "pageNo": Number(pageNo + 1),
        "pageSize": pageSize,
      }
    }).then((mediaList: Array<Media>) => buildMediaList(mediaList))
  }

  function getMediaItemUrl(mediaItemId: string): Promise<Array<IMediaUrl>> {
    return requestManager.post(`/v1/zero/media/assetlong/episode/playUrl/${mediaItemId}`, {})
  }

  function getMediaAuthorization(mediaId: string): Promise<IMediaAuthorization | null | undefined> {
    return requestManager.post(`/v2/zero/paid/accountAuth/authAssetLong`, {
      'data': mediaId
    })
  }

  function getMediaItemAuthorization(mediaItemId: string): Promise<IMediaAuthorization | null | undefined> {
    return requestManager.post(`/v2/zero/paid/accountAuth/authAssetLongEpisode`, {
      'data': mediaItemId
    })
  }

  return {
    install: function (app: ESApp) {
      const instance = this
      app.provide(MediaDataSourceKey, instance)
    },
    init,
    getMediaDetail,
    getMediaRecommendation,
    getMediaItemList,
    getMediaItemUrl,
    getMediaAuthorization,
    getMediaItemAuthorization
  }
}


