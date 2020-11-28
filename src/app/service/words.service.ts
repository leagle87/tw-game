import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WordresponseModel} from './model/wordresponse.model';
import {Subject} from 'rxjs';

@Injectable()
export class WordsService {

  private wordresponse: WordresponseModel = new WordresponseModel();
  private wordResponseSource = new Subject<WordresponseModel>();

  wordResponseFound = this.wordResponseSource.asObservable();

  constructor(private http: HttpClient) {
  }

  getWords(letterCount: number, minWordCount: number, minWordLength: number): void {
    this.http.get('assets/arcanum_hu_words.txt', {responseType: 'text'})
      .subscribe(data => {
        const splittedData: string[] = data.split('\n');
        splittedData.splice(splittedData.length - 1);
        this.wordresponse.wordList = [];
        while (this.wordresponse.wordList.length < minWordCount || !this.containsOnlyRelevantLetters()) {
          this.wordresponse.wordList = [];
          this.wordresponse.characterList = [];
          this.getRandomLetters(letterCount).forEach(ch => {
            this.wordresponse.characterList.push(ch);
          });
          splittedData.forEach(word => {
            if (word.trim().length >= minWordLength && this.contains(this.wordresponse.characterList, word.trim())) {
              this.wordresponse.wordList.push(word.trim());
            }
          });
        }
        this.wordresponse.wordList.sort(function (a, b) {
          return a.length - b.length;
        });
        this.wordResponseSource.next(this.wordresponse);
      });
  }

  private getRandomLetters(count: number): string[] {
    const result: string[] = [];
    const abc: string[] = ['a', 'á', 'b', 'c', 'd', 'e', 'é', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'm', 'n', 'o', 'ó', 'ö', 'ő', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'ü', 'ű', 'v', 'w', 'x', 'y', 'z'];
    for (let i = 0; i < count; i++) {
      const rnd =  Math.floor(Math.random() * abc.length);
      result.push(abc[rnd]);
    }
    return result;
  }

  private contains(charList: string[], word: string): boolean {
    const wordWorkCopy: string[] = word.split('');
    for (const ch of charList) {
      for (const wch of wordWorkCopy) {
        if (ch === wch) {
          wordWorkCopy.splice(wordWorkCopy.indexOf(wch), 1);
          break;
        }
      }
    }
    return wordWorkCopy.length === 0;
  }

  private containsOnlyRelevantLetters(): boolean {
    const wordWorkCopy: any[] = [];
    this.wordresponse.wordList.forEach(word => {
      wordWorkCopy.push(word.split(''));
    });

    const charListWorkCopy: any[] = [];
    this.wordresponse.characterList.forEach(ch => {
      charListWorkCopy.push({ch: ch, count: 0, alreadyCounted: false});
    });
    for (const wch of charListWorkCopy) {
      for (const word of wordWorkCopy) {
        wch.alreadyCounted = false;
        for (const ch of word) {
          if (ch === wch.ch && wch.alreadyCounted === false) {
            wch.count++;
            wch.alreadyCounted = true;
          }
        }
      }
    }
    let isValid = true;
    charListWorkCopy.forEach(ch => {
      if (ch.count === 0) {
        isValid = false;
      }
    });
    return isValid;
  }
}
