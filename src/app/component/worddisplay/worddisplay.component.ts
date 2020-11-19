import {Component, Input} from '@angular/core';
import {WordsService} from '../../service/words.service';
import {WordModel} from '../../model/word.model';

@Component({
  selector: 'app-word',
  templateUrl: './worddisplay.component.html',
  styleUrls: ['./worddisplay.component.css'],
  providers: [WordsService]
})
export class WorddisplayComponent {

  @Input() public word: WordModel;

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
