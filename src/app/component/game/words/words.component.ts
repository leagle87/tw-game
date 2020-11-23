import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WordsService} from '../../../service/words.service';
import {WordsModel} from '../../../model/words.model';
import {ScoreboardComponent} from '../../scoreboard/scoreboard.component';
import {MESSAGE_SENT, TmijsService} from '../../../service/tmijs.service';
import {WordresponseModel} from '../../../service/model/wordresponse.model';
import {WordModel} from '../../../model/word.model';
import {Message} from '../../../model/message';
import {Router} from '@angular/router';
import {LoadingService} from '../../../service/loading.service';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css'],
  providers: [WordsService]
})
export class WordsComponent implements OnInit, OnDestroy {
  words: WordsModel = new WordsModel();
  remainingTime;
  countBack: number;
  countBackMin = '0';
  countBackSec = '00';
  interval;
  gameActive = false;
  wordFoudedCount = 0;
  @ViewChild(ScoreboardComponent) private scoreboard: ScoreboardComponent;

  constructor(public wordsService: WordsService,
              public tmijsService: TmijsService,
              private loadingService: LoadingService,
              private router: Router) {
  }

  ngOnInit(): void {
    // if (!this.tmijsService.on || !this.tmijsService.connected) {
    //   this.leaveGame();
    // }
    this.tmijsService.eventEmitter.on(MESSAGE_SENT, data => {
      this.textRecieved(data);
    });
    this.wordsService.wordResponseFound.subscribe(data => {
      this.loadingService.loadingOff();
      this.startGame(data);
    });
    this.openTC();
  }

  ngOnDestroy(): void {
  }

  newGame() {
    this.loadingService.loadingOn();
    this.wordsService.getWords(8, 15, 3);
    this.wordFoudedCount = 0;
  }

  private startGame(data: WordresponseModel) {
    clearInterval(this.interval);
    this.countBack = this.remainingTime;
    this.calculateDisplayTime();
    this.words = new WordsModel();
    this.words.characterList = data.characterList;
    data.wordList.forEach(word => {
      this.words.wordList.push(new WordModel(word));
    });
    if (this.scoreboard) {
      this.scoreboard.reset();
    }
    this.gameActive = true;
    this.closeTC();
    this.interval = setInterval(() => {
      this.countBack--;
      this.calculateDisplayTime();
      if (this.countBack <= 0) {
        this.gameEnd();
      }
    }, 1000);
  }

  private calculateDisplayTime() {
    this.countBackMin = Math.floor(this.countBack / 60).toString();
    this.countBackSec = (this.countBack % 60).toString().length < 2 ? '0' + (this.countBack % 60).toString() : (this.countBack % 60).toString();
  }

  textRecieved(message: Message): void {
    if (this.gameActive) {
      for (let i = 0; i < this.words.wordList.length; i++) {
        if (this.words.wordList[i].founder === undefined && this.words.wordList[i].word === message.message) {
          this.words.wordList[i].founder = message.user;
          this.scoreboard.addScore(message.user, this.words.wordList[i].word.length);
          this.wordFoudedCount++;
          this.playAudio();
        } else if (this.words.wordList[i].word === message.message) {
          this.tmijsService.say('@' + message.user + ' a ' + message.message + ' vótmán');
        }
      }
    }
  }

  private gameEnd() {
    this.gameActive = false;
    this.words.wordList.forEach(word => {
      if (!word.founder) {
        word.notFounded = true;
      }
    });
    this.openTC();
  }

  leaveGame() {
    this.router.navigate(['/login']);
  }

  private playAudio() {
    const audio = new Audio();
    audio.src = '';
    audio.load();
    audio.play();
  }

  private openTC() {
    document.getElementById('timeControl').style.left = '0px';
  }

  private closeTC() {
    document.getElementById('timeControl').style.left = '-230px';
  }
}
