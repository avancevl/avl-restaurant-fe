import {
    AjaxManager,
    DatePicker,
    Loader,
    StoreNodeSource,
    Cache,
    ComboboxData,
    Combobox
} from '@cui/core';
import { AuthUser } from './data/entity/auth-user';
import { AuthUserNode } from './data/node/common';
import { environment } from '@environment';
import { getTranslateGO, TranslateConfig } from 'translate-go';

// 開啟翻譯工具
TranslateConfig.dev = !environment.production;
// 設定預設語系
TranslateConfig.defaultLanguage = environment.lang;

interface QueryString {
    [key: string]: string[];
}

export class Global {
    public static readonly env = environment;
    public static readonly translateGO = getTranslateGO();
    public static readonly ajaxManager = new AjaxManager();
    public static readonly datePicker = new DatePicker();
    public static readonly loader = new Loader();
    @StoreNodeSource(AuthUserNode)
    public static readonly authUser: AuthUser;
    @Cache.session('Global', '')
    public static currentRoute;
    @Cache.session('Global', '')
    public static currentRouteName;
    public static routeName = {};
    @Cache.session('Global', { array: [], map: {} })
    public static userCombobox: ComboboxData<Combobox>;
    private static queryParamters: QueryString = {};

    public static getParamter(key: string): string {
        let value = Global.queryParamters[key];
        return value ? value.join(',') : undefined;
    }

    public static getParamters(key: string): string[] {
        return Global.queryParamters[key];
    }

    /**
     * 解析URL Parameters
     */
    public static parseQueryString() {
        if (window.location.search) {
            let queryParameters = {};
            let queryString = window.location.search.substring(1);
            let params = queryString.split('&');
            let values, name, value;
            for (let i in params) {
                values = params[i].split('=');
                name = decodeURIComponent(values[0]);
                value = decodeURIComponent(values[1]);
                if (queryParameters[name]) {
                    queryParameters[name].push(value);
                } else {
                    queryParameters[name] = [value];
                }
            }
            Global.queryParamters = queryParameters;
        }
    }
}
