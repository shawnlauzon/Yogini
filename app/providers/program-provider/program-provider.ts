import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProgramProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProgramProvider {
  index: any;

  constructor(private http: Http) {
    this.index = null;
  }

  loadIndex() {
    if (this.index) {
      // already loaded index
      return Promise.resolve(this.index);
    }

    // don't have the index yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the index,
      // then on the response it'll map the JSON index to a parsed JS object.
      // Next we process the index and resolve the promise with the new index.
      this.http.get('programs/index.json')
        .map(res => res.json())
        .subscribe(index => {
          // we've got back the raw index, now generate the core schedule index
          // and save the index for later reference
          this.index = index;
          resolve(this.index);
        });
    });
  }

  loadProgram(id : string) {
    // TODO Cache after loading
    return new Promise(resolve => {
      // We're using Angular Http provider to request the index,
      // then on the response it'll map the JSON index to a parsed JS object.
      // Next we process the index and resolve the promise with the new index.
      this.http.get('programs/${id}.json')
        .map(res => res.json())
        .subscribe(index => {
          // we've got back the raw index, now generate the core schedule index
          // and save the index for later reference
          this.index = index;
          resolve(this.index);
        });
    });
  }
}

