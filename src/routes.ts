import home from './pages/home/index.vue'
import detail from './pages/detail/index.vue'
import introduction from './pages/introduction/index.vue'
import {ESRouteType} from "@extscreen/es3-router";
import screenList from './pages/filter/list.vue'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: home,
  },
  {
    path: '/detail',
    name: 'detail',
    component: detail,
  },
  {
    path: '/series_view',
    name: 'series_view',
    component: detail,
  },
  {
    path: '/introduction',
    name: 'introduction',
    component: introduction,
    type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
  {
    path: '/screenList',
    name: 'screenList',
    component: screenList,
  }
]
export default routes
