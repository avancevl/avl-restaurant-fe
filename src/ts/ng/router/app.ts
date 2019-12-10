import { BootRouteName } from './boot';
import { MainRoute, MainRouteName } from './main';
import { ManageRouteName } from './manage';
import { ToolRouteName } from './tool';
import { RestaurantRouteName } from './restaurant';

export enum AppRouteName {
    Default = '',
    /**
     * 主頁
     */
    Main = 'main',
    /**
     * 頁面不存在
     */
    NotFound = 'not-found',
}
export class AppRoute {

    /**
     * 主頁路由
     */
    public static Main = {} as MainRoute;

}

/**
 * 路由絕對路徑工具
 */
export class AppRouteUtil {
    /**
     *  擴展路由路徑
     * @param path
     * @param name
     */
    public static extend(path, name): any {
        const array = path;
        const newRoutePath = {};
        for (const i in name) {
            newRoutePath[i] = [].slice.call(array);
            if (name[i]) {
                newRoutePath[i].push(name[i]);
            }
        }
        return newRoutePath;
    }
}
// 產生 Main 路由絕對路徑
AppRoute.Main = AppRouteUtil.extend(['/' + AppRouteName.Main], MainRouteName);

AppRoute.Main.Tool = AppRouteUtil.extend(['/' + AppRouteName.Main, MainRouteName.Tool], ToolRouteName);
AppRoute.Main.Boot = AppRouteUtil.extend(['/' + AppRouteName.Main, MainRouteName.Boot], BootRouteName);
AppRoute.Main.Manage = AppRouteUtil.extend(['/' + AppRouteName.Main, MainRouteName.Manage], ManageRouteName);
AppRoute.Main.Restaurant = AppRouteUtil.extend(['/' + AppRouteName.Main, MainRouteName.Restaurant], RestaurantRouteName);
