export class WordModel {

  word: string;
  found: boolean = false;
  founder: string;
  notFounded: boolean = false;

  constructor(word: string) {
    this.word = word;
  }
}
