import {RequestDevelopParams} from "./RequestDevelopParams";
import {RequestBaseParams} from "./RequestBaseParams";
import {RequestUserParams} from "./RequestUserParams";
import {RequestRuntimeParams} from "./RequestRuntimeParams";
import {RequestDeviceParams} from "./RequestDeviceParams";

export interface RequestParams {
    developer: RequestDevelopParams
    device: RequestDeviceParams
    param: RequestBaseParams
    user: RequestUserParams
    runtime: RequestRuntimeParams
}
