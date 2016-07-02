import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { Http } from '@angular/http';
import { SC } from 'soundcloud';
// import * as soundcloud from 'soundcloud';
 
/*
  Generated class for the AsanaPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/asana/asana.html',
})
export class AsanaPage {
  program: any;

  constructor(private nav: NavController, navParams: NavParams, public http: Http) {
  	// TODO This should be handled with an Observable stream (Reative). For now
  	// just play the first one

  	this.program = navParams.get('program');
  	this.streamAudio(this.program.asanas[0].announce_audio_sc)
  }

  streamAudio(id: string) {
    const SC_CLIENT_ID = '69e382c16c5478ccb5ea223a0e1c4c92';
    const IG_CLIENT_ID = '6b419d3888d54ed8aba9d3871c1ea0dc';

    const IG_ACCESS_TOKEN = '181792531.6b419d3.301f178d7c9c458ba5fc5ba3aff62843';

    var audioStream = `/tracks/${id}`;
    console.log('Initializing ...');

    SC.initialize({
      client_id: '69e382c16c5478ccb5ea223a0e1c4c92'
    });

    // console.log('Loading resource for user: ');
    // soundcloud.get('/users/user-165327345').then(resource => {
    //   console.log('got resource:');
    //   console.log(resource);
    // });

    console.log(`Opening stream ${audioStream}`);

    SC.stream(audioStream).then(player => {
      player.play();
    });
  }

  playAudio(file: string) {
  	var audioFile = `audio/${file}.mp3`
  	console.log(`Playing file ${audioFile}`);

    // Create a MediaPlugin instance.  Expects path to file or url as argument
    var media = new MediaPlugin(audioFile);

    // Catch the Success & Error Output
    // Platform Quirks
    // iOS calls success on completion of playback only
    // Android calls success on completion of playback AND on release()
    // media.init.then(() => {
    //   console.log("Playback Finished");
    // }, (err) => {
    //   console.log("somthing went wrong! error code: "+err.code+" message: "+err.message);
    // });

    // play the file
    media.play();

    // release the native audio resource
    // Platform Quirks:
    // iOS simply create a new instance and the old one will be overwritten
    // Android you must call release() to destroy instances of media when you are done
    media.release();
  }
}

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
