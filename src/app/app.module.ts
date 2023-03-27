import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MessageComponent } from './components/message/message.component';
import {FormsModule} from "@angular/forms";
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import { ConfigService } from './config.service';
import {CinchyConfig, CinchyModule, CinchyService} from "@cinchy-co/angular-sdk";
import {MessageService} from "primeng/api";
import {DropdownModule} from "primeng/dropdown";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {AutoCompleteModule} from "primeng/autocomplete";
import {TooltipModule} from "primeng/tooltip";

export function appLoadFactory(config: ConfigService) {
  return () => config.loadConfig().toPromise();
}

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot([]),
        InputTextModule,
        ButtonModule,
        DividerModule,
        CinchyModule.forRoot(),
        DropdownModule,
        AutoCompleteModule,
        TooltipModule
    ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appLoadFactory,
      deps: [ConfigService],
      multi: true
    },
    CinchyModule,
    CinchyService,
    {
      provide: CinchyConfig,
      useFactory: (config: ConfigService) => {
        return config.envConfig;
      },
      deps: [ConfigService]
    },
    {provide: 'BASE_URL', useFactory: getBaseUrl},
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
