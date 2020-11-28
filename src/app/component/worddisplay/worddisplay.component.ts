import {Component, Input, OnInit} from '@angular/core';
import {WordsService} from '../../service/words.service';
import {WordModel} from '../../model/word.model';
import {MenuItem} from 'primeng/api';

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

  openSzotar() {
    window.open('https://www.arcanum.hu/hu/online-kiadvanyok/search/?query=' + this.word.word);
  }
}
