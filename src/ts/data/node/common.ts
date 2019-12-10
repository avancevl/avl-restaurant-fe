import { StoreNode } from '@cui/core';
import { AuthUser } from '../entity/auth-user';
import { environment } from '@environment';
import { Subscription } from 'ts/data/entity/entity';

// 右側選單寬度
export const MainMenuWidthNode = new StoreNode<number>({
    id: 'MainMenuWidth',
    cache: true,
    value: 0
});
// 表頭高度
export const MainHeaderHeightNode = new StoreNode<number>({
    id: 'MainHeaderWidth',
    cache: true,
    value: 0
});
// 表尾高度
export const MainFooterHeightNode = new StoreNode<number>({
    id: 'MainFooter',
    cache: true,
    value: 0
});

/**
 * 登入後使用者資料
 */
export const AuthUserNode = new StoreNode<AuthUser>({
    id: 'AuthUser',
    cache: true,
    timeout: true,
});

/**
 * 語系
 */
export const LangNode = new StoreNode<string>({
    id: 'Lang',
    cache: true,
    value: environment.lang,
});

/**
 * 訂閱
 */
export const SubscriptionsNode = new StoreNode<Subscription[]>({
    id: 'Subscriptions',
    cache: true,
    joinTo: [AuthUserNode],
});

export interface SubscriptionMap {
    [key: string]: Subscription;
}
/**
 * 訂閱Map
 */
export const SubscriptionMapNode = new StoreNode<SubscriptionMap>({
    id: 'SubscriptionMap',
    cache: true,
    parent: SubscriptionsNode,
    onBorn: function () {
        let array = SubscriptionsNode.get();
        let map = {}, data;
        for (let i in array) {
            data = array[i];
            map[data.tag + ':' + data.status] = data;
        }
        SubscriptionMapNode.set(map);
    }
});

