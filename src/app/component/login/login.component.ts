import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TwitchService} from '../../service/twitch.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  channel: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public twitchService: TwitchService) {
    this.channel = this.twitchService.activeChannel;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('code')) {
        this.twitchService.start(params.get('code'));
      }
    });
  }

  startGame() {
    this.router.navigate(['/game/words']);
  }

  loginTw() {
    window.open(this.twitchService.getLoginUrl(), '_self');
  }

  connectTw() {
    this.twitchService.joinChannel(this.channel);
  }

  quitTw() {
    this.twitchService.quit();
  }

  disconnectTw() {
    this.twitchService.leaveChannel();
  }

}
