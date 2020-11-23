export class WordModel {

  word: string;
  founder: string;
  notFounded = false;

  constructor(word: string) {
    this.word = word;
  }
}
