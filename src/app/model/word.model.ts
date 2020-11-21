export class WordModel {

  word: string;
  founder: string;
  notFounded: boolean = false;

  constructor(word: string) {
    this.word = word;
  }
}
