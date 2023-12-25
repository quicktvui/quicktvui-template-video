import {
  ESIPlayerInterceptor,
  ESMediaSourceList,
  ESPlayerInterceptorType,
  ESPlayerInterceptResult
} from "@extscreen/es3-player";
import {ESMediaItem} from "@extscreen/es3-player-manager";
import {IMediaDataSource} from "../../../datasource/media/IMediaDataSource";
import {buildMediaSourceList} from "../adapter/PlayerDataAdapter";

export function createESPlayerMediaItemInterceptor(dataSource: IMediaDataSource): ESIPlayerInterceptor {

  function intercept(...params: Array<any>): Promise<ESPlayerInterceptResult> {
    const mediaItem = params[0] as ESMediaItem
    return new Promise<ESPlayerInterceptResult>((resolve, reject) => {
      dataSource.getMediaItemUrl(mediaItem.id + "")
        .then((mediaUrlList) => {
          let mediaSourceList: ESMediaSourceList = {
            index: 0,
            list: buildMediaSourceList(mediaUrlList)
          }
          let result: ESPlayerInterceptResult = {
            result: {
              mediaSourceList: mediaSourceList,
            }
          }
          resolve(result)
        }, error => {
          reject(error)
        })
    })
  }

  function release(): void {
  }

  return {
    id: 'ESPlayerMediaItemInterceptor',
    type: ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
    intercept,
    release
  }
}
