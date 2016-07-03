import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ImgurProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ImgurProvider {
  cache: Map<string, any>;

  constructor(private http: Http) {
    this.cache = new Map<string, any>();
  }

  get(id: string): Promise<any> {
    console.log("ImgurProvider: Getting image " + id);

    const CLIENT_ID = 'b7e267260e7dbb3';
    const IMAGE_URL = 'https://api.imgur.com/3/image/';

    if (this.cache.has(id)) {
      // already loaded data
      return Promise.resolve(this.cache.get(id));
    }

    // don't have the data yet
    // TODO If we're already in the process or retrieving an image, we should
    // wait until that image has already been retrieved
    return new Promise(resolve => {
      console.log('Retrieving remotely ...');
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get(IMAGE_URL + id, {
          headers: new Headers({ 'Authorization': 'Client-ID ' + CLIENT_ID })
        })
        .map(res => res.json())
        .subscribe(result => {
          if (result.success) {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            this.cache.set(id, result.data);
            resolve(result.data);
          } else {
            console.log(`Received ${result.status} from Imgur`);
          }
        });
    });
  }
}

