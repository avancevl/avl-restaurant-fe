import { AjaxMethod, AjaxTryCatch, AjaxUtil } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Asserts } from '../../util/asserts';
import { Global } from '../../globle';

/**
 * 端口
 */
export class ApiService {

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static query(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetApi,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 新增
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static add(formData, callback) {
		Asserts.notEmpty(formData.path, 'path' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PostApi,
			method: AjaxMethod.POST,
			headers: AjaxUtil.ContentTypeJson,
			data: JSON.stringify(formData),
			callback: callback
		});
	}

	/**
	 * 修改
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static modify(formData, callback) {
		Asserts.notEmpty(formData.id, 'id' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.path, 'path' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PutApi,
			method: AjaxMethod.PUT,
			headers: AjaxUtil.ContentTypeJson,
			data: JSON.stringify(formData),
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
			url: ApiPath.DeleteApi,
			method: AjaxMethod.DELETE,
			headers: AjaxUtil.ContentTypeJson,
			data: JSON.stringify(formData),
			callback: callback
		});
	}
}
