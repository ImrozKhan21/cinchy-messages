import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {
  messages = [    { content: 'Hello!', isReceived: true },    { content: 'Hi! How are you?', isReceived: false },    { content: 'I am good, thanks. How about you?', isReceived: true },    { content: 'I am also good, thanks!', isReceived: false },  ];
  newMessage = '';

  ngOnInit() {
  }

  addMessage() {
    if (!this.newMessage) {
      return;
    }

    this.messages.push({
      content: this.newMessage,
      isReceived: false,
    });

    this.newMessage = '';
  }
}
