import { AppRoute } from '../ng/router/app';
import { ApiPath } from './api';
import { Apis } from 'ts/data/entity/auth-user';

export interface IRouteUseApi {
    [route: string]: Apis;
}

export let RouteUseApi: IRouteUseApi = {};

/**
 * 首頁
 */
RouteUseApi[AppRoute.Main.Index.join('/')] = {
    get: [ApiPath.GetSelf, ApiPath.GetUserCombobox
        , ApiPath.GetActuatorMappings
    ],
    post: [],
    put: [ApiPath.PutSelf, ApiPath.PutSelfPassword, ApiPath.PutSelfPasswordReset],
    delete: []
};

/**
 * 角色
 */
RouteUseApi[AppRoute.Main.Manage.Role.join('/')] = {
    get: [ApiPath.GetRolePage, ApiPath.GetRolePermission],
    post: [ApiPath.PostRole],
    put: [ApiPath.PutRole, ApiPath.PutRolePermission],
    delete: []
};

/**
 * 使用者管理
 */
RouteUseApi[AppRoute.Main.Manage.User.join('/')] = {
    get: [ApiPath.GetUserPage, ApiPath.GetRoleCombobox],
    post: [ApiPath.PostUser],
    put: [ApiPath.PutUser, ApiPath.PutUserDisable, ApiPath.PutUserEnable, ApiPath.PutUserLock, ApiPath.PutUserUnlock, ApiPath.PutUserPassword, ApiPath.PutUserPasswordReset],
    delete: []
};

/**
 * 選單管理
 */
RouteUseApi[AppRoute.Main.Manage.Route.join('/')] = {
    get: [ApiPath.GetRoute, ApiPath.GetRouteFolder],
    post: [ApiPath.PostRoute],
    put: [ApiPath.PutRoute],
    delete: [ApiPath.DeleteRoute]
};

/**
 * API管理
 */
RouteUseApi[AppRoute.Main.Manage.Api.join('/')] = {
    get: [ApiPath.GetApi, ApiPath.GetActuatorMappings],
    post: [ApiPath.PostApi],
    put: [ApiPath.PutApi],
    delete: [ApiPath.DeleteApi]
};

/**
 * 訪問紀錄
 */
RouteUseApi[AppRoute.Main.Manage.AccessLog.join('/')] = {
    get: [ApiPath.GetAccessLogPage],
    post: [],
    put: [],
    delete: [ApiPath.DeleteAccessLog]
};

/**
 * 訪問紀錄群組
 */
RouteUseApi[AppRoute.Main.Manage.AccessLogGroup.join('/')] = {
    get: [ApiPath.GetAccessLogGroupPage, ApiPath.GetAccessLogDetilPage],
    post: [],
    put: [],
    delete: [ApiPath.DeleteAccessLog]
};

/**
 * 系統例外紀錄
 */
RouteUseApi[AppRoute.Main.Manage.ExceptionLog.join('/')] = {
    get: [ApiPath.GetExceptionLogPage],
    post: [],
    put: [],
    delete: [ApiPath.DeleteExceptionLog]
};

/**
 * Session 管理
 */
RouteUseApi[AppRoute.Main.Manage.Session.join('/')] = {
    get: [ApiPath.GetSession, ApiPath.GetSessionGroup],
    post: [],
    put: [],
    delete: [ApiPath.DeleteSession]
};

/**
 * 緩存管理
 */
RouteUseApi[AppRoute.Main.Boot.CacheManage.join('/')] = {
    get: [ApiPath.GetCache],
    post: [ApiPath.PostCacheClear, ApiPath.PostCacheEvict],
    put: [],
    delete: []
};

/**
 * 系統訊息
 */
RouteUseApi[AppRoute.Main.Boot.Info.join('/')] = {
    get: ['/actuator/.+'],
    post: ['/actuator/.+'],
    put: [],
    delete: ['/actuator/.+']
};

RouteUseApi[AppRoute.Main.Restaurant.Manage.join('/')] = {
    get: [ApiPath.GetRestaurantCombobox, ApiPath.GetRestaurantPage],
    post: [],
    put: [],
    delete: []
};


RouteUseApi[AppRoute.Main.Restaurant.Order.join('/')] = {
    get: [ApiPath.GetBookingPage],
    post: [],
    put: [],
    delete: []
};



