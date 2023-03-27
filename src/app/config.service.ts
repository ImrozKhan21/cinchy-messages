import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {forkJoin} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { CinchyConfig } from '@cinchy-co/angular-sdk';
import {IEnv} from "./models/common.model";
import {environment} from "../environments/environment";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  enviornmentConfig!: IEnv;
  fullScreenHeight: any;
  showPersonLogo: any;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
              @Inject(PLATFORM_ID) private platformId: any) {
    window.addEventListener('message', this.receiveMessage, false);
    this.setRowAndFormId();
  }

  setRowAndFormId() {
    if (isPlatformBrowser(this.platformId)) {
      let id = this.getQueryStringValue('id', window.location.search);
      let showPersonLogo = this.getQueryStringValue('showPersonLogo', window.location.search);
      if (!id) {
        id = this.getQueryStringValue('id', document.referrer);
        showPersonLogo = this.getQueryStringValue('showPersonLogo', document.referrer);
      }
      id && sessionStorage.setItem('id', id);
      showPersonLogo && sessionStorage.setItem('showPersonLogo', showPersonLogo);

      if (!sessionStorage.getItem('id') || id) {
        id && id != "null" ? sessionStorage.setItem('id', id) : sessionStorage.setItem('id', '');
      }

         if (!sessionStorage.getItem('showPersonLogo') || showPersonLogo) {
           showPersonLogo && showPersonLogo != "null" ? sessionStorage.setItem('showPersonLogo', showPersonLogo)
             : sessionStorage.setItem('showPersonLogo', '');
         }
         this.showPersonLogo = showPersonLogo;
      console.log('session', sessionStorage.getItem('id'));
    }
  }

  getQueryStringValue(key: string, url: string) {
    return decodeURIComponent(url.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }

  get envConfig(): CinchyConfig {
    return this.enviornmentConfig;
  }

  loadConfig() {
    return forkJoin(this.getEnvUrl());
  }

  getEnvUrl() {
    const whichConfig = environment.production ? 'config_prod.json' : 'config_local.json';
    const url = `${this.baseUrl}assets/${whichConfig}`;
    return this.http
      .get<any>(url).pipe(
        tap(config => {
          this.enviornmentConfig = config
        }));
  }

  receiveMessage(event: any) {
    if (event.data.toString().startsWith('[Cinchy][innerHeight]')) {
      this.fullScreenHeight = parseInt(event.data.toString().substring(21), 10) + 4;
      console.log('receiveMessage  IF', this.fullScreenHeight)
      localStorage.setItem('fullScreenHeight', this.fullScreenHeight.toString());
      const elements: any = document.getElementsByClassName('full-height-element');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < elements.length; i++) {
        setTimeout(() => {
          if(window.location !== window.parent.location){
            // @ts-ignore
            if (this.showPersonLogo !== 'false') {
              elements[i]['style'].height = this.fullScreenHeight + 'px';
            }
          }
        }, 500)
      }
    }
  }
}
