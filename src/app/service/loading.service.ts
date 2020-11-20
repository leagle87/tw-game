import {Injectable} from '@angular/core';

@Injectable()
export class LoadingService {

  loadingOn() {
    document.getElementById('overlay').style.display = 'block';
  }

  loadingOff() {
    document.getElementById('overlay').style.display = 'none';
  }

}
