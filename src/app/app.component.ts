import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from './model/message';
import {WordsService} from './service/words.service';
import {WordsModel} from './model/words.model';
import {WordModel} from './model/word.model';
import {ScoreboardComponent} from './component/scoreboard/scoreboard.component';
import {MESSAGE_SENT, TmijsService} from './service/tmijs.service';
import {WordresponseModel} from './service/model/wordresponse.model';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WordsService]
})
export class AppComponent implements OnInit, OnDestroy {
  channel: string = 'black_xs';
  userName: string = environment.user;
  pass: string = environment.pass;
  words: WordsModel = new WordsModel();
  remainingTime = 60;
  countBack: number;
  interval;
  gameActive: boolean = false;
  connected: boolean = false;
  @ViewChild(ScoreboardComponent) private scoreboard: ScoreboardComponent;

  constructor(private wordsService: WordsService,
              public tmijsService: TmijsService) {
  }
  ngOnInit(): void {
    this.wordsService.wordResponseFound.subscribe(data => {
      document.getElementById('overlay').style.display = 'none';
      this.startGame(data);
    });
  }

  ngOnDestroy(): void {
    this.tmijsService.stop();
  }

  newGame() {
    document.getElementById('overlay').style.display = 'block';
    this.wordsService.getWords();
  }

  private startGame(data: WordresponseModel) {
    clearInterval(this.interval);
    this.countBack = this.remainingTime;
    this.words = new WordsModel();
    this.words.characterList = data.characterList;
    data.wordList.forEach(word => {
      this.words.wordList.push(new WordModel(word))
    });
    if (this.scoreboard) {
      this.scoreboard.reset();
    }
    this.gameActive = true;
    this.interval = setInterval(() => {
      this.countBack--;
      if (this.countBack <= 0) {
        this.gameEnd();
      }
    }, 1000);

  }

  connect(): void {
    this.tmijsService.joinChannel(this.channel);
    this.tmijsService.eventEmitter.on(MESSAGE_SENT, data => {
      this.textRecieved(data);
    });
  }

  disconnect(): void {
    this.tmijsService.leaveChannel(this.channel);
  }

  textRecieved(message: Message): void {
    if (this.gameActive) {
      for (let i = 0; i < this.words.wordList.length; i++) {
        if (this.words.wordList[i].found == false && this.words.wordList[i].word === message.message) {
          this.words.wordList[i].found = true;
          this.words.wordList[i].founder = message.user;
          this.scoreboard.addScore(message.user, this.words.wordList[i].word.length);
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
    })
  }

  login() {
    this.tmijsService.start(this.userName, this.pass).then(() => {
      this.connected = true;
    });
  }

  logout() {
    this.tmijsService.stop();
    this.connected = false;
  }
}
