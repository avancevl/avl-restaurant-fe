import { ApiClassName, ApiPath } from '../constant/api';
import { Global } from '../globle';

export class RoleUtil {
    public static readonly adminLevel = 1;
    public static readonly styleId = 'role-style';

    /**
     * 更新 Authority css style
     */
    public static updatePermissionStyle() {
        let content = '';
        let path;
        if (Global.authUser) {
            let gets = Global.authUser.apis.get;
            let posts = Global.authUser.apis.post;
            let puts = Global.authUser.apis.put;
            let deletes = Global.authUser.apis.delete;
            for (let id in ApiPath) {
                path = ApiPath[id];
                if (id.startsWith('Get') && gets.indexOf(path) == -1) {
                    content += '.' + ApiClassName[id] + '{display:none}';
                } else if (id.startsWith('Post') && posts.indexOf(path) == -1) {
                    content += '.' + ApiClassName[id] + '{display:none}';
                } else if (id.startsWith('Put') && puts.indexOf(path) == -1) {
                    content += '.' + ApiClassName[id] + '{display:none}';
                } else if (id.startsWith('Delete') && deletes.indexOf(path) == -1) {
                    content += '.' + ApiClassName[id] + '{display:none}';
                }
            }
        } else {
            for (let id in ApiPath) {
                content += '.' + ApiClassName[id] + '{display:none}';
            }
        }

        let style: HTMLStyleElement = document.head.querySelector('#' + RoleUtil.styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = RoleUtil.styleId;
            document.head.appendChild(style);
        }
        style.innerText = content;
    }

    /**
     * 檢查是否有權限 依API路徑
     * @param path
     */
    public static isPermission(method: string, path: ApiPath): boolean {
        if (!method) {
            return false;
        }
        if (!Global.authUser) {
            return false;
        }
        return Global.authUser.apis[method.toLowerCase()].indexOf(path) == -1 ? false : true;
    }

    /**
     * 檢查是否有權限 依角色等級
     * @param level
     */
    public static isPermissionByLevel(level: number, user?: number) {
        if (!Global.authUser) {
            return false;
        }
        if (Global.authUser.level == RoleUtil.adminLevel) {
            return true;
        }
        if (user && Global.authUser.id == user) {
            return true;
        }
        return Global.authUser.level < level;
    }
}
