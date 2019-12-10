import { AjaxMethod, AjaxTryCatch, IAjaxManagerResultCallback, Grid } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Asserts } from '../../util/asserts';
import { Global } from '../../globle';
import { RequestSession } from 'ts/data/entity/auth-user';

/**
 * Session
 */
export class SessionService {

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static query(formData, callback: IAjaxManagerResultCallback<Grid.IPage<RequestSession>>) {
		Global.ajaxManager.request({
			url: ApiPath.GetSession,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static group(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetSessionGroup,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 刪除
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static remove(formData, callback) {
		Asserts.notEmpty(formData.id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.DeleteSession,
			method: AjaxMethod.DELETE,
			data: formData,
			callback: callback
		});
	}
}
