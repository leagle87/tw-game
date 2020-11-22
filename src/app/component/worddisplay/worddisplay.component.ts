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
export class WorddisplayComponent implements OnInit {

  @Input() public word: WordModel;
  menuItems: MenuItem[];

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Mit jelent?',
        command: () => {
          this.openSzotar();
        }
      }
    ];
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  private openSzotar() {
    window.open('https://www.arcanum.hu/hu/online-kiadvanyok/search/?query=' + this.word.word);
  }
}
