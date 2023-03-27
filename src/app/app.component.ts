import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {CinchyService} from "@cinchy-co/angular-sdk";
import {ApiCallsService} from "./services/api-calls.service";
import {AppStateService} from "./services/app-state.service";
import {Router} from "@angular/router";
import {WindowRefService} from "./services/window-ref.service";
import {IUser} from "./models/common.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cinchy-messages';
  loginDone!: boolean;
  userDetails: IUser;
  fullScreenHeight: number = 697;

  constructor(private appStateService: AppStateService, private cinchyService: CinchyService,
              private apiCallsService: ApiCallsService, @Inject(PLATFORM_ID) private platformId: any,
              private windowRefService: WindowRefService, private router: Router) {
  }

  ngOnInit() {
    const isIframe = this.windowRefService.inIframe();
    this.cinchyService.checkIfSessionValid().toPromise().then((response: any) => {
      if (response.accessTokenIsValid) {
        this.setDetails();
      } else {
        if (isPlatformBrowser(this.platformId)) {
          this.cinchyService.login().then(success => {
            if (success) {
              this.setDetails();
            }
          }, error => {
            console.error('Could not login: ', error)
          });
        }
      }
    });
  }

  async setDetails() {
    this.loginDone = true;
    this.apiCallsService.setUserDetails().then(val => {
      this.userDetails = val;
      this.appStateService.userDetails = this.userDetails;
      console.log('111 userDetails', this.userDetails);

      this.appStateService.setUserDetailsSub(this.userDetails);
      const userDetail = localStorage.getItem('hub-user-details') || '';
      //  console.log('In user details', val);
      if (!val && userDetail) {
        //  console.log('In no user details if', userDetail);
        this.userDetails = userDetail ? JSON.parse(userDetail) : null;
        console.log('111 2userDetails', this.userDetails);

        this.appStateService.userDetails = this.userDetails;
        this.appStateService.setUserDetailsSub(this.userDetails);
      }
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('hub-user-details', JSON.stringify(val));
      }
    }).catch((e: any) => {
      if (isPlatformBrowser(this.platformId)) {
        console.error(e);
        const userDetail = localStorage.getItem('hub-user-details') || '';
        this.userDetails = userDetail ? JSON.parse(userDetail) : null;
        console.log('111 3 userDetails', this.userDetails);

        this.appStateService.userDetails = this.userDetails;
        this.appStateService.setUserDetailsSub(this.userDetails);
        console.error(e);
      }
    });
  }
}
