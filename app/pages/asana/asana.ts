import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { InAppBrowser } from 'ionic-native';
import { CordovaOauth, Instagram } from 'ng2-cordova-oauth/core';
import { Jsonp, Http, Headers } from '@angular/http';
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
  cordovaOauth: CordovaOauth;
  accessToken: string = '181792531.6b419d3.301f178d7c9c458ba5fc5ba3aff62843';

  imageUrl: string;

  constructor(private nav: NavController, navParams: NavParams, 
    /*public jsonp: Jsonp, */ public http: Http) {
  	// TODO This should be handled with an Observable stream (Reative). For now
  	// just play the first one

  	this.program = navParams.get('program');
    console.log(this.program);

    if (this.accessToken == null) {
      this.signIntoInstagram();
    } else {
      this.showImage(this.program.asanas[0].image_ur);
    }
  	// this.streamAudio(this.program.asanas[0].announce_audio_sc)
  }

  showImage(id: string) {
    const IMGUR_CLIENT_ID = 'b7e267260e7dbb3';

    console.log('Loading image ' + id);

    //var url = `https://api.imgur.com/3/account/miyogini/images/ids/`;
    var url = `https://api.imgur.com/3/image/${id}`;

    this.http.get(url, {
      headers: new Headers({ 'Authorization': 'Client-ID ' + IMGUR_CLIENT_ID })
    })
    .map(response => response.json())
    .subscribe(response => {
      console.log(response);
      this.imageUrl = response.data.link;
    });

    // then((success) => {
    //   console.log('success: ' + success);
    // }, (error) => {
    //   console.log('error: ' + error);
    // });

    // this.http.get(`https://api.instagram.com/v1/media/${id}?access_token=${this.accessToken}`)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     this.images = data.data.images;
    //   });
  };

  signIntoInstagram() {
    console.log('Attempting to sign into Instagram');

    const IG_CLIENT_ID = '6b419d3888d54ed8aba9d3871c1ea0dc';
    const IG_ACCESS_TOKEN = '181792531.6b419d3.301f178d7c9c458ba5fc5ba3aff62843';

    console.log('Attempt init oAuth');
    this.cordovaOauth = new CordovaOauth(new Instagram({ 
      clientId: IG_CLIENT_ID, 
      appScope: ["basic, public_content"], 
      redirectUri: 'http://localhost/callback'
    }));
    console.log('Attempt sign into IG');

    this.cordovaOauth.login().then((success) => {
      console.log(JSON.stringify(success));
      this.accessToken = JSON.parse(JSON.stringify(success)).access_token;
      console.log('Got access token: ' + this.accessToken);
      // TODO store access token and load image
    }, (error) => {
      console.log(JSON.stringify(error));
      console.log('Skipping images');
    });
  }


  streamAudio(id: string) {
    const SC_CLIENT_ID = '69e382c16c5478ccb5ea223a0e1c4c92';

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
    // var media = new MediaPlugin(audioFile);

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
    // media.play();

    // release the native audio resource
    // Platform Quirks:
    // iOS simply create a new instance and the old one will be overwritten
    // Android you must call release() to destroy instances of media when you are done
    // media.release();
  }
}
