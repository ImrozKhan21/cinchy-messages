import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, of, tap} from "rxjs";
import {IUser} from "../models/common.model";
import {CinchyService} from "@cinchy-co/angular-sdk";
import {WindowRefService} from "./window-ref.service";
import {isPlatformBrowser} from "@angular/common";
import {ConfigService} from "../config.service";
import {AppStateService} from "./app-state.service";

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  constructor(private http: HttpClient, private cinchyService: CinchyService, @Inject(PLATFORM_ID) private platformId: any,
              private configService: ConfigService, private appStateService: AppStateService) {
  }

  getPeople() {
    const url = `/API/Zero-Integration%20App%20Factory/Ask%20Cinchy%20People%20Names`;
    return this.getResponse(url);
  }

  getQuestionsHistory(id: number) {
    const url = `/API/Zero-Integration%20App%20Factory/Get%20Ask%20Cinchy%20Questions%20By%20Person?%40personId=${id}`;
    return this.getResponse(url);
  }

  insertQuestion(id: number, question: string) {
    const url = `/API/Zero-Integration%20App%20Factory/Insert%20Ask%20Cinchy%20Question?%40person=${id}&%40question=${question}`;
    return this.getResponse(url);
  }

  clearHistory(id: number) {
    const url = `/API/Zero-Integration App Factory/Delete All Messages by User?%40personId=${id}`;
    return this.getResponse(url);
  }

  executeCinchyQueries(name: string, domain: string, options?: any, isInsert?: boolean): Observable<any> {
    return this.cinchyService.executeQuery(domain, name, options).pipe(
      map(resp => isInsert ? resp : resp?.queryResult?.toObjectArray())
    );
  }

  async setUserDetails(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let userObjectFromStorageStr;
      if (isPlatformBrowser(this.platformId)) {
        userObjectFromStorageStr = sessionStorage.getItem('id_token_claims_obj');
      }
   //   console.log('IN IF SESSION USER', userObjectFromStorageStr);
      if (userObjectFromStorageStr) {
        const userObjectFromStorage = JSON.parse(userObjectFromStorageStr);
     //   console.log('IN IF 2 SESSION USER', userObjectFromStorageStr);
        const userDetails = await this.getLoggedInUserDetails(userObjectFromStorage.id).toPromise() as IUser[];
     //   console.log('IN IF 2 SESSION userDetails', userDetails)
        resolve(userDetails[0]);
      } else {
       // console.log('IN USER ELSE INSIDE 1', this.cinchyService.getUserIdentity);
        let userDetail = localStorage.getItem('hub-user-details') || '';
        if (isPlatformBrowser(this.platformId)) {
     //     console.log('IN USER ELSE LOCAL');
          userDetail = userDetail ? JSON.parse(userDetail) : null;
          resolve(userDetail);
        }
        if (!userDetail) {
          this.cinchyService.getUserIdentity().subscribe(async (user: any) => {
         //   console.log('IN USER ELSE INSIDE', user);
            if (user?.id) {
           //   console.log('IN USER ELSE INSIDE ID', user);
              const userDetailsIdentity = await this.getLoggedInUserDetails(user.id).toPromise() as IUser[];
             // console.log('IN USER ELSE INSIDE ID userDetailsIdentity', userDetailsIdentity);
              resolve(userDetailsIdentity[0]);
            } else {
             // console.log('IN USER ELSE INSIDE ID userDetailsIdentity REJECT');
              reject('No user details');
            }
          }, error => {
            console.log('IN REJECT')
            reject('No user details');
          });
        }
      }
    })
  }

  getLoggedInUserDetails(userName: string): Observable<IUser[]> {
    const url = `/API/Zero-Integration%20App%20Factory/Get%20User%20Details?%40userName=${userName}`;
    return this.getResponse(url);
  }

  getResponse(url: string): Observable<any> {
    const fullUrl = `${this.configService.enviornmentConfig.cinchyRootUrl}${url}`
    return this.http.get(fullUrl, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text'
    }).pipe(
      map(resp => {
        const {data, schema} = JSON.parse(resp);
        return this.toObjectArray(data, schema);
      }))
  }

  toObjectArray(data: any, schema: any): Array<Object> {
    let result: any = [];
    data?.forEach((row: any) => {
      let rowObject: any = {};
      for (let i = 0; i < row.length; i++) {
        rowObject[schema[i].columnName] = row[i];
      }
      result.push(rowObject);
    });
    return result;
  }

  logOut() {
    const cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
      const d = window.location.hostname.split(".");
      while (d.length > 0) {
        const cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
        const p = location.pathname.split('/');
        document.cookie = cookieBase + '/';
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
        }
        d.shift();
      }
    }
  }

}
