import {Component} from '@angular/core';
import {TmijsService} from '../../service/tmijs.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {LoadingService} from '../../service/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = environment.user;
  pass: string = environment.pass;
  channel = 'black_xs';

  constructor(public tmijsService: TmijsService,
              private loadingService: LoadingService,
              private router: Router) {
  }

  login() {
    this.loadingService.loadingOn();
    this.tmijsService.start(this.userName, this.pass).then(() => {
      this.loadingService.loadingOff();
    });
  }

  logout() {
    this.tmijsService.stop();
  }

  connect() {
    this.tmijsService.joinChannel(this.channel);
  }

  disconnect() {
    this.tmijsService.leaveChannel(this.channel);
  }

  startGame() {
    this.router.navigate(['/game/words']);
  }
}
