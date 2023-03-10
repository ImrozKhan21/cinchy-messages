import {Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {ApiCallsService} from "../../services/api-calls.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {IHistory, IPeople} from "../../models/common.model";
import {WindowRefService} from "../../services/window-ref.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer: ElementRef;

  messages: { content: string, isReceived: boolean, showDelivered?: boolean }[] = [];
  newMessage = '';

  people: IPeople[];
  selectedPerson: IPeople;
  newMessageResponse: string;
  showIsTyping = false;
  isIframe: boolean;
  history: IHistory[];
  showDelivered = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private apiCallsService: ApiCallsService, private activatedRoute: ActivatedRoute, private router: Router,
              private windowRefService: WindowRefService,  @Inject(PLATFORM_ID) private platformId: any) {
  }

  async ngOnInit() {
    this.isIframe = this.windowRefService.inIframe();
    this.people = await this.apiCallsService.getPeople().toPromise();
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      if (isPlatformBrowser(this.platformId)) {
        const currentPersonId = params['id'] ? params['id'] : sessionStorage.getItem('id');
        if (currentPersonId) {
          this.selectedPerson = this.people.find(person => person.Id == currentPersonId) as IPeople;
          console.log('111 person ID', currentPersonId, this.selectedPerson);
        }
        this.selectedPerson = this.selectedPerson ? this.selectedPerson : this.people[0];
        this.getHistory();
      }
    });
  }

  async getHistory() {
    const id = this.selectedPerson.Id;
    const history = await this.apiCallsService.getQuestionsHistory(id).toPromise();
    history.forEach((message: IHistory, index:number) => {
      this.messages.push({
        content: message.Question,
        isReceived: false,
        showDelivered: index === history.length - 1
      });
      this.messages.push({
        content: message.Answer,
        isReceived: true,
      })
    });
    this.scrollToLast();
  }

  scrollToLast() {
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 0);
  }

  personChanged() {
    this.messages = [];
    this.getHistory();
  }

  async addMessage() {
    if (!this.newMessage) {
      return;
    }
    this.messages.forEach(message => message.showDelivered = false);
    this.messages.push({
      content: this.newMessage,
      isReceived: false,
      showDelivered: true
    });
    const messageForUpdate = this.newMessage;
    this.newMessage = '';
    this.showIsTyping = true;
    this.scrollToLast();
    try {
      const newResponse = await this.apiCallsService.insertQuestion(this.selectedPerson.Id, messageForUpdate).toPromise();
      this.newMessageResponse = newResponse[0].Answer;
      this.messages.push({
        content: this.newMessageResponse,
        isReceived: true,
      });
      this.showIsTyping = false;
      this.scrollToLast();
    } catch (e) {
      // show error
      this.showIsTyping = false;
      this.newMessageResponse = '';
      this.scrollToLast();
    }
    this.newMessage = '';
  }

  async clearConversationForUser() {
    await this.apiCallsService.clearHistory(this.selectedPerson.Id).toPromise();
    this.messages = [];
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
