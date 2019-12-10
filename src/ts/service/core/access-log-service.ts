import { AjaxMethod, AjaxTryCatch, AjaxUtil } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Global } from '../../globle';

/**
 * 系統訪問紀錄
 */
export class AccessLogService {
	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static page(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetAccessLogPage,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static groupPage(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetAccessLogGroupPage,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static detilPage(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetAccessLogDetilPage,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 刪除紀錄
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static remove(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.DeleteAccessLog,
			method: AjaxMethod.DELETE,
			data: formData,
			callback: callback
		});
	}
}
