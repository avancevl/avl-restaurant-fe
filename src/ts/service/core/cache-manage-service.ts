import { AjaxMethod, IAjaxManagerResultCallback } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Global } from '../../globle';


export interface CacheEvictForm {
	/** 快取區塊名稱 */
	name: string;
	/** 快取資料key */
	key: string;
	/** 是否通知夥伴 */
	notify: boolean;
}

export interface CacheClearForm {
	/** 是否通知夥伴 */
	notify: boolean;
	/** 快取區塊名稱 */
	name?: string;
}

/**
 * 快取管理
 */
export class CacheManageService {
	/**
	 * @param form
	 * @param callback
	 */
	public static query(url: string, callback: IAjaxManagerResultCallback) {
		Global.ajaxManager.request({
			url: url + ApiPath.GetCache,
			callback: callback
		});
	}

	/**
	 * evict
	 * @param form
	 * @param callback
	 */
	public static evict(url: string, formData: CacheEvictForm, callback: IAjaxManagerResultCallback) {
		Global.ajaxManager.request({
			url: url + ApiPath.PostCacheEvict,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}

	/**
	 * clear
	 * @param form
	 * @param callback
	 */
	public static clear(url: string, formData: CacheClearForm, callback: IAjaxManagerResultCallback) {
		Global.ajaxManager.request({
			url: url + ApiPath.PostCacheClear,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}

	/**
	 * clear
	 * @param form
	 * @param callback
	 */
	public static clearAll(url: string, callback: IAjaxManagerResultCallback) {
		Global.ajaxManager.request({
			url: url + ApiPath.PostCacheClear,
			method: AjaxMethod.POST,
			callback: callback
		});
	}
}
