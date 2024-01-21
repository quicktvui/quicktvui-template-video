import {IMedia} from "../IMedia";
import {Media} from "./Media";
import {IMediaAuthorization} from "../IMediaAuthorization";
import {MediaAuthorization} from "./MediaAuthorization";


export function buildMedia(media: Media): IMedia {
  let m: IMedia = {
    id: media.id,
    title: media.assetTitle,

    type: media.assetType,
    tags: media.tags,
    //
    coverH: media.coverH,
    coverV: media.coverV,
    directors: media.directors,

    //
    language: media.language,
    releaseDate: media.publishTime,
    licenceNum: media.licenceNum,
    //
    subtitle: media.description1,
    actors: media.description2,
    introduction: media.description,

    score: media.doubanScore,
    corner: {
      text: media.cornerContent ?? '',
      startColor: media.cornerColor,
      endColor: media.cornerGradient
    },
    itemList: {
      id: media.dataItems != undefined ? media.dataItems[0].id : '',
      title: media.dataItems != undefined ? media.dataItems[0].episodeTabName : '',
      count: media.episodeCount,
      type: media.dataItems != undefined ? media.dataItems[0].episodeTabStyle : 0,
      enable: media.dataItems != undefined && media.dataItems[0].showEpisodeTab == '1'
    },
    //
    itemListId: media.dataItems != undefined ? media.dataItems[0].id : '',
    //分集的总数
    itemListCount: media.episodeCount
  }
  return m
}


export function buildMediaList(mediaList: Array<Media>): Array<IMedia> {
  const medias: Array<IMedia> = []
  for (let i = 0; i < mediaList.length; i++) {
    const m = mediaList[i]
    medias.push(buildMedia(m))
  }
  return medias
}

export function buildMediaAuthorization(authorization: MediaAuthorization): IMediaAuthorization {
  let auth: IMediaAuthorization = {
    id: authorization.assetLongId,
    auth: authorization.auth,
    payType: authorization.payType,
    type: authorization.type,
    typeName: authorization.typeName,
  }
  return auth
}

