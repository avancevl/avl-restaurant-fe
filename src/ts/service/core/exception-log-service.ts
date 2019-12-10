import { AjaxMethod, AjaxTryCatch, AjaxUtil } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Global } from '../../globle';

/**
 * 系統訪問紀錄
 */
export class ExceptionLogService {
	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static page(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetExceptionLogPage,
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
			url: ApiPath.DeleteExceptionLog,
			method: AjaxMethod.DELETE,
			data: formData,
			callback: callback
		});
	}
}
