import {Component} from '@angular/core';
import {WordsService} from './service/words.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WordsService]
})
export class AppComponent {

}
