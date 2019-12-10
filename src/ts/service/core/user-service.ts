import { AjaxMethod, AjaxTryCatch, CUI, AjaxUtil, Combobox, ComboboxCallback, ComboboxData } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Asserts } from '../../util/asserts';
import { BasicService } from './basic-service';
import { environment } from '@environment';
import { Global } from '../../globle';
import { JSEncrypt } from 'jsencrypt';

/**
 * 超級管理使用者
 */
export class UserService {
	/**
	 * 下拉选单
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static combobox(callback: ComboboxCallback<ComboboxData<Combobox>>) {
		Global.ajaxManager.request({
			url: ApiPath.GetUserCombobox
			, callback: function (result) {
				if (!result.success) {
					// alert(AjaxUtil.getMessage(result));
					callback({ array: [], map: {} });
					return;
				}
				let array: Combobox[] = result.data;
				callback({ array: array, map: CUI.comboboxToValueName(array) });
			}
		});
	}

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static page(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetUserPage,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 註冊
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static add(formData, callback) {
		Asserts.notEmpty(formData.account, 'account' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.password, 'password' + Asserts.NotEmptyMessage);

		let _formData = CUI.deepClone(formData);
		// 先取得公鑰
		BasicService.wow(function (result) {
			if (result.success) {
				let jsencrypt = new JSEncrypt();
				jsencrypt.setPublicKey(result.data);
				// 加密密碼
				_formData.password = jsencrypt.encrypt(_formData.password);
				Global.ajaxManager.request({
					url: ApiPath.PostUser,
					method: AjaxMethod.POST,
					headers: AjaxUtil.ContentTypeJson,
					data: JSON.stringify(_formData),
					callback: callback
				});
			} else {
				callback(result);
			}
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
		Global.ajaxManager.request({
			url: ApiPath.PutUser,
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
		// 先取得公鑰
		BasicService.wow(function (result) {
			if (result.success) {
				let jsencrypt = new JSEncrypt();
				jsencrypt.setPublicKey(result.data);
				// 加密密碼
				_formData.password = jsencrypt.encrypt(_formData.password);
				_formData.newPassword = jsencrypt.encrypt(_formData.newPassword);
				Global.ajaxManager.request({
					url: ApiPath.PutUserPassword,
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
	@AjaxTryCatch(1)
	public static resetPassword(formData, callback) {
		Asserts.notEmpty(formData.id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PutUserPasswordReset,
			method: AjaxMethod.PUT,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 启用
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static enable(id: number, callback) {
		Asserts.notNull(id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PutUserEnable,
			method: AjaxMethod.PUT,
			data: { id: id },
			callback: callback
		});
	}

	/**
	 * 禁用
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static disable(id: number, callback) {
		Asserts.notNull(id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PutUserDisable,
			method: AjaxMethod.PUT,
			data: { id: id },
			callback: callback
		});
	}

	/**
	 * 冻结
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static lock(id: number, callback) {
		Asserts.notNull(id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PutUserLock,
			method: AjaxMethod.PUT,
			data: { id: id },
			callback: callback
		});
	}

	/**
	 * 解锁
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static unlock(id: number, callback) {
		Asserts.notNull(id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PutUserUnlock,
			method: AjaxMethod.PUT,
			data: { id: id },
			callback: callback
		});
	}
}
