import { AjaxMethod, AjaxTryCatch, AjaxUtil } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Asserts } from '../../util/asserts';
import { Global } from '../../globle';

export interface ProxyRequest {
	url: string;
	method: string;
	headers?: string;
	params?: string;
	body?: string;
	connectionTimeout?: number;
	readTimeout?: number;
}


/**
 * 伺服器代理發送請求
 */
export class ProxyService {
	/**
	 * 使用GET由伺服器代發請求
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static get(formData: ProxyRequest, callback) {
		Asserts.notEmpty(formData.url, 'url' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.GetProxy,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 使用POST由伺服器代發請求
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static post(formData: ProxyRequest, callback) {
		Asserts.notEmpty(formData.url, 'url' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PostProxy,
			method: AjaxMethod.POST,
			headers: AjaxUtil.ContentTypeJson,
			data: JSON.stringify(formData),
			callback: callback
		});
	}
}
