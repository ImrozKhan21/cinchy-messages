import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

function _window(): any {
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  constructor(@Inject(PLATFORM_ID) private readonly _platformId: object) { }

  get nativeWindow(): any {
    return _window();
  }

  isSSR(): boolean {
    return  !isPlatformBrowser(this._platformId);
  }

  inIframe(): any {
    if(isPlatformBrowser(this._platformId)) {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }
  }
}
