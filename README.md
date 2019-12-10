# avl-restaurant-fe



## 目的

提供使用者透過UI管理服務。

## 技術

* Angular 6+

## 工具

* Visual Studio Code
    
    __擴充功能__
        
    * Angular 6 and TypeScript/HTML VS Code Snippets
    * Angular Language Service
    * Beautify
    * GitLens
    * Sort Typescript Imports
    * TSLint

* [translate-go](https://github.com/babyblue94520/translate-go)

    多國語系工具

## 部屬方式

1. 依環境執行 __npm run build-prod-*__
2. 將 __dist__ 裡的檔案同步到 __${user.home}/webs/avl-restaurant-fe/__ 
## 專案說明

### 目錄結構

* __app__(預設)

    Angular module、component等等的根目錄
    
    * __app-common__ 自行開發的共用 Angualr Component，盡量不要直接修改，如有修改請 __同步__ 到各相同結構的專案
    * 
* __assets__(預設)

    靜態資料夾，不需要任何編譯的靜態資料可以放在這個目錄下

        <link rel="stylesheet" type="text/css" href="assets/css/icon/flaticon/flaticon.css" />

    * __css/icon/flaticon__
    
        從[Flaticon](https://www.flaticon.com/)下載的免費 font icon

* __environments__(預設)

    系統環境參數，可以依據不同環境設定 __ts__，在由 __angular.json__ 設定替換。

        "fileReplacements": [{
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.prod.proxy.ts"
        }]

* __scss__

    全域的 *.scss檔案

* __ts__

    獨立於 __Angular__ 物件外的共用 __*.ts__，提高重用跟降低耦合

    * __constant__

        存放固定不便的常量變數物件

        * __api.ts__

            透過 __開發工具>API資料產生__ 產生的ts檔，減少開發時，對 __API__ 權限設定命名錯誤，提供統一的 __API Class Name__ 或者 __API Path__ 給 介面跟 __Ajax__ 使用

        * __route-use-api.ts__

            提供給 __角色__ 權限設定介面使用的資料

    * __data__

        存放資料物件的介面或者 __StoreNode__ 

    * __ng__
     
        存放 __Angular__ 專門設計的 __*.ts__，例如路由表。

    * __lib__

        存放外部引入的 __*.ts__，盡量不要直接修改，如有修改請 __同步__ 到各相同結構的專案

    * __service__

        存放依不同業務需要取得資料方法或者執行所設計的服務，將與畫面渲染無關的商務邏輯或者方法抽出來，提高重用跟降低耦合

    * __uitl__

        存方靜態的共用方法，譬如資料格式的轉換

* __styles.scss__(預設)

    angular 預設會將它編譯成 __css__ 語法，輸出成 __js__ or __css__ 檔 

## 功能

* ### 系統管理

    * __使用者管理__

        管理可登入系統的 __使用者__ 和 __角色__

    * __選單管理__

        管理前端左側選單資料

    * __API管理__

        管理後端 __API__ 資料

    * __角色等級__

        管理 __角色等級__，數字越低、權限越高，權限最高為 __1__

    * __角色__

        管理 __角色__，設定群組可顯示 __選單__ 和可訪問 __API__ 權限

    * __訪問紀錄__

        __查詢__、__刪除__ 所有訪問該服務的請求紀錄

    * __訪問紀錄群組__

        依群組方式 __查詢__、__刪除__ 所有訪問該服務的請求紀錄

    * __系統例外紀錄__

        __查詢__、__刪除__ 操作該系統出現的任何 __錯誤例外__ 紀錄

* ### 超級系統管理

    * __系統資訊__

        透過 __Spring Actuator__ 提供的接口，將資料格式化輸出，使閱讀更方便 [參考](https://www.baeldung.com/spring-boot-actuators)

        * __info__:系統訊息

        * __health__:系統狀態 

        * __env__:查看載入配置和系統環境變數

        * __metrics__:系統當前狀態指標，譬如記憶體使用、Session、Http請求

        * __mappings__:系統對外提供的API

        * __beans__:系統當前持久化物件

        * __configprops__:系統目前的配置

        * __autoconfig__:系統自動配置狀態

        * __auditevents__:系統事件紀錄

    * __日誌輸出管理__

        控制系統的log輸出等級

    * __即時系統指標__

        透過 __metrics__ 不斷蒐集資訊，用chart.js圖表呈現系統指標

* ### 開發工具

    * __代理訪問__

        將Http請求由伺服器端發送出去

    * __時間格式轉換__

        利用moment做時間轉換的工具

    * __API資料產生__

        透過 __mappings__ 將所有API轉成 Typescript 資料格式

## 注意事項

1. 盡量使用 __ng__ 建立Angular物件
2. __*.component.html__ 只能對應到 __*.component.ts__ Component class 裡的宣告變數，無法解析 __*.ts__ 公開的變數
3. 如有上述需求，請參考 __src/app/basic-component.ts__ 設計方式，不同的 __module__ 請自行設計 __NameBasicComponent__ 並繼承 __BasicCompoent__

4. 延續上述，盡量以下面範例 __import__，讓 __ts__ 與 __html__ 上操作體驗一致

    __ts__

        import { Global as GlobalOrigin } from 'ts/globle';

        export abstract class BasicComponent implements OnDestroy {
            public Global = GlobalOrigin;

    __html__

        <div>{{Global.xxx}}</div>


5. 在 __ChangeDetectionStrategy.OnPush__ 時，__setTimeout__、__setInterval__ 和 __Ajax callback__ 並不會觸發 __markForCheck__，得手動執行。

        constructor(private cdf: ChangeDetectorRef) {
            super();
            setTimeout(()=>{
                this.cdf.markForCheck();
            },0)
        }
        
## 重要

* ### 登入機制

    * 先透過 __FeatureKey__，向後端申請產生 __RSA__ 公私鑰並回傳 __public key__，再利用 __public key__ 加密 __使用者密碼__，提交登入，因為後台有完整的 __訪問紀錄__ 避免使用者明碼保留再資料庫中，透過每次使用不同的 __RSA__ 公私鑰，讓任何人無法透過任何方式解密。

    * 有傳送 __使用者密碼__ 的請求都應該使用該機制

* ### 閒置檢查機制

    * __PingerService__ 透過後端提供的 __Pinger API__，不斷的訪問取得 __timeout__，快到期時，彈出視窗提醒，最後登出


* ### AjaxManager 中間層

    在 __MainModule__ 實作 __AjaxManager__ 請求跟回覆的攔截

    * __ajaxBeforeRequest__

        發出請求時，__config.background = false__ ，則自動顯示 __loader__

    * __ajaxBeforeCallback__

        請求回覆前，優先做以下處理:

        1. __statusCode 401__

            使用者未登入或者失效了，重新初始化並不返回請求到原本的 __callback__

        2. __刷新資料__

            檢查返回資料 __result.refresh__ 是否有資料，並更新到對應的 __StoreNode__，目前處理 __User、Feature、Timeout、Subscriptions__ Key

* ### 權限管理&渲染機制

    * __左側選單__

        透過登入使用者資訊中，取得選單列表

    * __操作權限__

        透過登入使用者資訊中，取得可訪問API列表，再利用 __RoleUtil.updatePermissionStyle__ 產生沒有權限的 __API Class Name__ 的 __display:none__ 樣式，達到動隱藏沒有權限的物件