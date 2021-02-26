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

  public addScore(name: string, score: number) {
    this.addPlayerScore(this.players, name, score);
  }

  reset() {
    this.players = [];
  }

  addPlayersToAllTime() {
    for (const player of this.players) {
      this.addPlayerScore(this.allTimePlayers, player.name, player.score)
    }
  }

  private findPlayerByName(list: WordplayerModel[], name: string): WordplayerModel {
    for (const player of list) {
      if (player.name === name) {
        return player;
      }
    }
    return null;
  }

  private addPlayerScore(list: WordplayerModel[], name: string, score: number) {
    let player = this.findPlayerByName(list, name);
    if (player == null) {
      player = new WordplayerModel(name);
      list.push(player);
    }
    player.score += score;
    list.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);
  }
}
