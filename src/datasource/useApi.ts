import {inject, InjectionKey} from 'vue'
import {ITabDataSource} from "./homeimpl/ITabDataSource";
import {IMediaDataSource} from "./media/IMediaDataSource";

export const TabDataSourceKey = Symbol('TabAPIKey') as InjectionKey<ITabDataSource>
export const MediaDataSourceKey = Symbol('MediaDataSourceKey') as InjectionKey<IMediaDataSource>

export function useTabDataSource(): ITabDataSource {
    return inject(TabDataSourceKey)!
}

export function useMediaDataSource(): IMediaDataSource {
    return inject(MediaDataSourceKey)!
}
