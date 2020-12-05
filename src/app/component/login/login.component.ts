import {Component, OnInit} from '@angular/core';
import {TmijsService} from '../../service/tmijs.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {TwitchService} from '../../service/twitch.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [TwitchService]
})
export class LoginComponent implements OnInit {
  userName: string = environment.user;
  pass: string = environment.pass;
  channel: string;

  constructor(public tmijsService: TmijsService,
              private route: ActivatedRoute,
              private router: Router,
              private twitchService: TwitchService) {
    this.channel = this.tmijsService.currentChannel;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('code')) {
        console.log(params.get('code'));
        this.twitchService.getTokens(params.get('code')).then(() => {
          this.twitchService.start().then(() => {
            console.log('connected');
          });
          }
        );
      }
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

  loginTw() {
    window.open(this.twitchService.getLoginUrl(), '_self');
  }

  connectTw() {
    this.twitchService.join(this.channel);
  }

  say() {
    this.twitchService.say();
  }
}
