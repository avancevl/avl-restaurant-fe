import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantComponent } from './restaurant.component';
import { RestaurantManageComponent } from './restaurant-manage/restaurant-manage.component';
import { RestaurantOrderComponent } from './restaurant-order/restaurant-order.component';
import { RestaurantRouteName } from 'ts/ng/router/restaurant';
import { Routes, RouterModule } from '@angular/router';
import { AppCommonModule } from 'app/app-common/app-common.module';
import { CommonDialogModule } from 'app/main/dialog/common-dialog/common-dialog.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RestaurantModule.routes),
    FormsModule,
    AppCommonModule,
    CommonDialogModule,
  ],
  declarations: [RestaurantComponent, RestaurantManageComponent, RestaurantOrderComponent],
})
export class RestaurantModule {
  public static routes: Routes = [
    {
      path: '', component: RestaurantComponent, children: [
        { path: '', redirectTo: RestaurantRouteName.Manage, pathMatch: 'full' },
        { path: RestaurantRouteName.Manage, component: RestaurantManageComponent },
        { path: RestaurantRouteName.Order, component: RestaurantOrderComponent },
      ]
    }
  ];
}
