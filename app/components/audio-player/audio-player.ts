import { Component } from '@angular/core';
import { IONIC_DIRECTIVES } from 'ionic-angular';
import SC = require('soundcloud');

/*
  Generated class for the AudioPlayer component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'audio-player',
  templateUrl: 'build/components/audio-player/audio-player.html',
  directives: [AudioPlayer]
}) 
export class AudioPlayer {
  private player: any;

  icon: string = 'play';

  constructor() {
    console.log('Creating AudioPlayer');

    const SC_CLIENT_ID = '69e382c16c5478ccb5ea223a0e1c4c92';
    SC.initialize({
      client_id: SC_CLIENT_ID
    });

    // this.load('271734566').then(result => {
    //   this.play()
    // });
  }

  audioToggled(event) {
    switch (this.icon) {
      case 'pause':
        this.pause();
        break;
      case 'play':
        this.play();
        break;
    }
  }

  play() {
    console.log('play');
    this.player.play();
    this.icon = 'pause';
  }

  pause() {
    console.log('pause');
    this.player.pause();
    this.icon = 'play';
  }

  load(id: string): Promise<{}> {
    const STREAM_URL = '/tracks/';

    console.log('Loading audio ' + STREAM_URL + id);

    return new Promise(resolve => {
      SC.stream(STREAM_URL + id).then(player => {
        this.player = player;
        resolve();
      });
    });
  }  
}
