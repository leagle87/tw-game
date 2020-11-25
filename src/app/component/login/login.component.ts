import {Component} from '@angular/core';
import {TmijsService} from '../../service/tmijs.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {WordsService} from '../../service/words.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [WordsService]
})
export class LoginComponent {
  userName: string = environment.user;
  pass: string = environment.pass;
  channel: string;
  private startTime: number;
  private endTime: number;

  constructor(public tmijsService: TmijsService,
              private router: Router,
              private wordsService: WordsService) {
    this.channel = this.tmijsService.currentChannel;
    this.wordsService.wordResponseFound.subscribe(data => {
      this.endTime = new Date().getTime();
      console.log(this.endTime - this.startTime + 'ms');
    });
  }

  login() {
    this.tmijsService.start(this.userName, this.pass);
  }

  logout() {
    this.tmijsService.stop();
  }

  connect() {
    this.tmijsService.joinChannel(this.channel);
  }

  disconnect() {
    this.tmijsService.leaveChannel();
  }

  startGame() {
    this.router.navigate(['/game/words']);
  }

  test() {
    for (let i = 6; i < 11; i++) {
      console.log('letter count: ' + i);
      this.startTime = new Date().getTime();
      this.wordsService.getWords(i, 15, 3);
    }
  }
}
