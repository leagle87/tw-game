import {Component, Input} from '@angular/core';
import {WordsService} from '../../service/words.service';
import {WordModel} from '../../model/word.model';
import {TmijsService} from '../../service/tmijs.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private tmijsService: TmijsService) {
  }
}
