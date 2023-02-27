import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {IDropdownClick, IFooter, IOption, ITag, IUser} from "../models/common.model";
import {ICommunityDetails, MappedCombinedCountryKey} from "../models/general-values.model";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  search$: Subject<string> = new Subject<string>();
  reset$: Subject<boolean> = new Subject<boolean>();
  dropdownOptionClicked$: Subject<IDropdownClick> = new Subject<IDropdownClick>();
  topTagClicked$: Subject<ITag[]> = new Subject<ITag[]>();
  sidebarToggled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentSidebarOption$: Subject<string> = new Subject<string>();
  userDetails$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(({} as IUser));
  avatars: any;
  communityDetails: ICommunityDetails[];
  userDetails: IUser;

  constructor() {
  }


  setUserDetailsSub(val: IUser) {
    this.userDetails$.next(val);
  }

  getUserDetailsSub() {
    return this.userDetails$.asObservable();
  }
}
