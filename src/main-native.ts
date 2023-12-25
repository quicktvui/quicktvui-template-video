//--------------------router-----------------------
import routes from "./routes.ts";
//--------------------ESApp-----------------------
import {ESApp,} from '@extscreen/es3-vue';
import application from './App.vue';
import {createESApp} from "@extscreen/es3-core";
import {ESComponent} from "@extscreen/es3-component";
import {createESPlayer} from "@extscreen/es3-player";
import {createESVideoPlayer} from "@extscreen/es3-video-player";
import {createESPlayerManager} from "@extscreen/es3-player-manager";
import {createESADPlayer} from "@extscreen/es3-ad-player";

//--------------------components-----------------------
const routerOptions = {
  main: 'home',
  error: 'error',
  limit: 5,
  routes: routes,
}

const app: ESApp = createESApp(application, routerOptions);

app.use(ESComponent);

const player = createESPlayer();
app.use(player);

const playerManager = createESPlayerManager()
app.use(playerManager);

const videoPlayer = createESVideoPlayer();
app.use(videoPlayer);

const ADPlayer = createESADPlayer();
app.use(ADPlayer);

//---------------------------QuickTVUI----------------------------------
import '@quicktvui/quicktvui3/dist/index.css';
import {QuickTVUI} from "@quicktvui/quicktvui3";

app.use(QuickTVUI);

//---------------------------网络请求----------------------------------
import {createRequestManager, RequestManager} from "./utils/request/RequestManager";

const requestManger: RequestManager = createRequestManager()
app.use(requestManger);
//---------------------------网络接口----------------------------------
import {createTabDataSource} from "./datasource/homeimpl/TabDataSourceImpl";
import {ITabDataSource} from "./datasource/homeimpl/ITabDataSource";

const tabDataSource: ITabDataSource = createTabDataSource()
app.use(tabDataSource);

import {IMediaDataSource} from "./datasource/media/IMediaDataSource";
import {createMediaDataSource} from "./datasource/media/impl/MediaDataSourceImpl";

const mediaDataSource: IMediaDataSource = createMediaDataSource()
app.use(mediaDataSource);
//---------------------------用户管理----------------------------------
import {createUserManager, UserManager} from "./utils/user/UserManager";
import {createLaunch, Launch} from "./utils/launch/Launch";

const userManager: UserManager = createUserManager()
app.use(userManager);

//---------------------------启动管理----------------------------------
import {createLaunch, Launch} from "./utils/launch/Launch";

const launch: Launch = createLaunch()
app.use(launch);
