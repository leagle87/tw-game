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

  public addScore(name: string, score: number) {
    let player: WordplayerModel = this.findPlayerByName(name);
    if (player == null) {
      player = new WordplayerModel(name);
      this.players.push(player)
    }
    player.score += score;
    this.players.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);
  }

  private findPlayerByName(name): WordplayerModel {
    for (const player of this.players) {
      if (player.name === name) {
        return player;
      }
    }
    return null;
  }


  reset() {
    this.players = [];
  }
}
