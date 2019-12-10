import { AjaxMethod, AjaxTryCatch, CUI, AjaxUtil } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Asserts } from '../../util/asserts';
import { BasicService } from './basic-service';
import { environment } from '@environment';
import { Global } from '../../globle';
import { JSEncrypt } from 'jsencrypt';

/**
 * 修改當前使用者資料
 */
export class SelfService {

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static get(callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetSelf,
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
		Asserts.notEmpty(formData.id, 'account' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PutSelf,
			method: AjaxMethod.PUT,
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
	public static modifyPassword(formData, callback) {
		Asserts.notEmpty(formData.password, 'password' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.newPassword, 'new password' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.confirmPassword, 'confirm password' + Asserts.NotEmptyMessage);
		Asserts.notLess(formData.newPassword, environment.passwordLength, 'new password' + Asserts.NotLessMessage + environment.passwordLength);
		Asserts.notEquals(formData.password, formData.newPassword, 'password and new password' + Asserts.CanNotSame);
		Asserts.isEquals(formData.newPassword, formData.confirmPassword, 'new password and confirm password' + Asserts.NotSame);

		let _formData = CUI.deepClone(formData);
		BasicService.wow(function (result) {
			if (result.success) {
				let jsencrypt = new JSEncrypt();
				jsencrypt.setPublicKey(result.data);
				_formData.password = jsencrypt.encrypt(_formData.password);
				_formData.newPassword = jsencrypt.encrypt(_formData.newPassword);
				Global.ajaxManager.request({
					url: ApiPath.PutSelfPassword,
					method: AjaxMethod.PUT,
					data: _formData,
					callback: callback
				});
			} else {
				callback(result);
			}
		});
	}

	/**
	 * 重設密碼
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static resetPassword(callback) {
		Global.ajaxManager.request({
			url: ApiPath.PutSelfPasswordReset,
			method: AjaxMethod.PUT,
			callback: callback
		});
	}
}
