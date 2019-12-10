import {
	AjaxMethod,
	AjaxTryCatch,
	AjaxUtil,
	StoreNodeSource
} from '@cui/core';
import { ApiPath } from 'ts/constant/api';
import { Asserts } from 'ts/util/asserts';
import { Global } from 'ts/globle';
import { Subscription } from 'ts/data/entity/entity';
import { SubscriptionMap, SubscriptionMapNode, SubscriptionsNode } from '../../data/node/common';

/**
 * 訂閱服務
 */
export class SubscriptionService {

	@StoreNodeSource(SubscriptionsNode, [])
	public static subscriptions: Subscription[];
	@StoreNodeSource(SubscriptionMapNode, {})
	public static subscriptionMap: SubscriptionMap;

	public static find(tag: string, status: string): Subscription {
		return SubscriptionService.subscriptionMap[tag + ':' + status];
	}

	/**
	 * 查詢使用者訂閱
	 * @return
	 */
	@AjaxTryCatch(0)
	public static querySelf(callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetSubscriptionSelf,
			callback: callback
		});
	}

	/**
	 * 新增訂閱
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static add(formData, callback?) {
		Asserts.notEmpty(formData.tag, 'tag' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.status, 'status' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PostSubscription,
			method: AjaxMethod.POST,
			headers: AjaxUtil.ContentTypeJson,
			data: JSON.stringify(formData),
			callback: callback
		});
	}

	/**
	 * 新增移除
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static remove(formData, callback?) {
		Asserts.notEmpty(formData.tag, 'tag' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.status, 'status' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.DeleteSubscription,
			method: AjaxMethod.DELETE,
			headers: AjaxUtil.ContentTypeJson,
			data: JSON.stringify(formData),
			callback: callback
		});
	}
}
