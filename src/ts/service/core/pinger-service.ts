import { ApiPath } from '../../constant/api';
import { BasicService } from './basic-service';
import { DateUtil } from '../../util/date-util';
import { Global } from '../../globle';
import { AjaxMethod } from '@cui/core';



/**
 * 檢查用戶閒置
 */
export class PingerService {
	private static timeout = 0;
	private static timeUpTime = 0;
	private static countdownTimer;
	private static checkTimer;
	private static isCountDown = false;
	// 低於這個時間就開始倒數
	private static countdownStartTime = 45000;
	private static countdownCheckInterval = 5000;


	/**
	 * 開始檢查閒置
	 */
	public static start(timeout?: number) {
		if (timeout) {
			PingerService.timeout = timeout;
			PingerService.timeUpTime = (<number>DateUtil.now()) + PingerService.timeout;
			PingerService.count();
		} else {
			Global.ajaxManager.request({
				background: true,
				url: ApiPath.PostPingerCheck,
				method: AjaxMethod.POST,
				callback: (result) => {
					if (result.success) {
						PingerService.timeout = result.data;
						PingerService.timeUpTime = (<number>DateUtil.now()) + PingerService.timeout;
						PingerService.count();
					}
				}
			});
		}
	}

	/**
	 * 檢查
	 */
	public static check() {
		Global.ajaxManager.request({
			background: true,
			url: ApiPath.PostPingerCheck,
			method: AjaxMethod.POST,
			callback: (result) => {
				if (result.success) {
					PingerService.timeout = result.data;
					PingerService.timeUpTime = (<number>DateUtil.now()) + PingerService.timeout;
					PingerService.count();
				}
			}
		});
	}

	/**
	 * 停止
	 */
	public static stop() {
		PingerService.isCountDown = false;
		PingerService.closeMessage();
		clearTimeout(PingerService.checkTimer);
		clearTimeout(PingerService.countdownTimer);
	}

	/**
	 * 計算
	 */
	private static count() {
		if (!PingerService.timeout) {
			return;
		}
		if (PingerService.timeout < 0) {
			PingerService.timeUp();
		} else if (PingerService.timeout < PingerService.countdownStartTime) {
			if (!PingerService.isCountDown) {
				PingerService.showMessage();
				PingerService.isCountDown = true;
			}
			PingerService.doCountDown();
			let nextCheckTime = PingerService.countdownCheckInterval;
			if (nextCheckTime > PingerService.timeout) {
				nextCheckTime = PingerService.timeout;
			}
			clearTimeout(PingerService.checkTimer);
			PingerService.checkTimer = setTimeout(PingerService.check, nextCheckTime);
		} else {
			if (PingerService.isCountDown) {
				PingerService.closeMessage();
				PingerService.isCountDown = false;
			}
			let nextCheckTime = Math.floor(PingerService.timeout / 2);
			if (nextCheckTime < PingerService.countdownStartTime) {
				nextCheckTime = PingerService.timeout - PingerService.countdownStartTime;
			}
			clearTimeout(PingerService.checkTimer);
			PingerService.checkTimer = setTimeout(PingerService.check, nextCheckTime);
		}
	}

	/**
	 * 取得剩餘時間
	 */
	private static getCountdown() {
		return Math.floor((PingerService.timeUpTime - (<number>DateUtil.now())) / 1000);
	}

	/**
	 * 顯示提醒
	 */
	private static showMessage() {
		Global.loader.open();
		PingerService.doCountDown();
	}

	/**
	 * 關閉提醒
	 */
	private static closeMessage() {
		Global.loader.close();
	}

	/**
	 * 倒數
	 */
	private static doCountDown() {
		let countdown = PingerService.getCountdown();
		if (countdown <= 0) {
			PingerService.closeMessage();
			PingerService.timeUp();
			return;
		}
		Global.loader.message('倒數' + countdown + '登出');
		clearTimeout(PingerService.countdownTimer);
		PingerService.countdownTimer = setTimeout(PingerService.doCountDown, 1000);
	}

	/**
	 * 時間到
	 */
	private static timeUp() {
		PingerService.stop();
		BasicService.logout((result) => {
			if (!result.success) {
				BasicService.init();
			}
			alert('系統閒置太長，已登出!');
		});
	}
}
