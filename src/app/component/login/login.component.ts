import {Component} from '@angular/core';
import {TmijsService} from '../../service/tmijs.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = environment.user;
  pass: string = environment.pass;
  channel: string;

  constructor(public tmijsService: TmijsService,
              private router: Router) {
    this.channel = this.tmijsService.currentChannel;
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
}
