import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileImageDirective } from './profile-image.directive';
import { FileDownloadService } from './services/file-download.service';
import { NotificationService } from './services/notification.service';
import { AccountService } from './accounts/account.service';
import { StoreService } from './services/store.service';
import { MapService } from './services/map.service';
import { LocalForageService } from './services/localforage.service';
import { TranscationHistoryService } from './services/transcation-history.service';
import { ConfirmCancelOrderComponent } from './confirm-cancel-order/confirm-cancel-order.component';
import { AngularMaterialModule } from 'app/shared/angular-material/angular-material.module';
import { NavigationService } from './services/navigation.service'
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule
  ],
  declarations: [
    ProfileImageDirective,
    ConfirmCancelOrderComponent
  ],
  providers: [
    FileDownloadService,
    NotificationService,
    NotificationService,
    AccountService,
    StoreService,
    MapService,
    NavigationService,
    TranscationHistoryService,
    LocalForageService,
  ],
  exports: [
    ProfileImageDirective,
    ConfirmCancelOrderComponent
  ]

})
export class SharedModule { }
