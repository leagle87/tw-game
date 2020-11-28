import {Component} from '@angular/core';
import {WordsService} from '../../service/words.service';
import {WordplayerModel} from '../../model/wordplayer.model';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
  providers: [WordsService]
})
export class ScoreboardComponent {

  public players: WordplayerModel[] = [];
  public allTimePlayers: WordplayerModel[] = [];

  // constructor() {
  //   const wordplayerModel1 = new WordplayerModel('birka');
  //   wordplayerModel1.score = 10;
  //   this.allTimePlayers.push(wordplayerModel1);
  //   const wordplayerModel2 = new WordplayerModel('leagle');
  //   wordplayerModel2.score = 8;
  //   this.allTimePlayers.push(wordplayerModel2);
  //   const wordplayerModel3 = new WordplayerModel('black');
  //   wordplayerModel3.score = 3;
  //   this.allTimePlayers.push(wordplayerModel3);
  // }

  public addScore(name: string, score: number) {
    let player: WordplayerModel = this.findPlayerByName(this.players, name);
    if (player == null) {
      player = new WordplayerModel(name);
      this.players.push(player);
    }
    player.score += score;
    this.players.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);
  }

  private findPlayerByName(list: WordplayerModel[], name: string): WordplayerModel {
    for (const player of list) {
      if (player.name === name) {
        return player;
      }
    }
    return null;
  }

  reset() {
    this.players = [];
  }

  addPlayersToAllTime() {
    for (const player of this.players) {
      let playerToAdd = this.findPlayerByName(this.allTimePlayers, player.name);
      if (playerToAdd == null) {
        playerToAdd = new WordplayerModel(player.name);
        this.allTimePlayers.push(playerToAdd);
      }
      playerToAdd.score += player.score;
    }
    this.allTimePlayers.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);
    console.log(this.allTimePlayers);
  }
}
