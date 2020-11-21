export class WordModel {

  word: string;
  founder: string;
  founderColor: string;
  notFounded: boolean = false;

  constructor(word: string) {
    this.word = word;
  }
}
