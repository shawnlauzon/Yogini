import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CordovaOauth, Instagram } from 'ng2-cordova-oauth/core';
import { ImgurProvider } from '../../providers/imgur-provider/imgur-provider';
import { AudioPlayer } from '../../components/audio-player/audio-player';

// This is how to use something pulled from a script without typings defined
// declare var SC: any;

/*
  Generated class for the AsanaPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/asana/asana.html',
  directives: [AudioPlayer],
  providers: [ImgurProvider]
})
export class AsanaPage {
  @ViewChild('audio1') audio: AudioPlayer;
  program: any;

  imageUrl: string;
  asanaName: string;
  asanaDescription: string;

  constructor(private imgur: ImgurProvider, private nav: NavController, 
    private navParams: NavParams) {
  	// TODO This should be handled with an Observable stream (Reative). For now
  	// just play the first one

  	this.program = navParams.get('program');

    this.asanaName = this.program.asanas[0].name;
    this.asanaDescription = this.program.asanas[0].description;
    
    this.imgur.get(this.program.asanas[0].image_ur).then(data => {
      this.imageUrl = data.link;
    })
  }

  ngAfterViewInit() {
    console.log('Loading audio ...');
    this.audio.load(this.program.asanas[0].announce_audio_sc).then(result => {
      this.audio.play()
    });
  }

  signIntoInstagram() {
    var cordovaOauth: CordovaOauth;
    var igAccessToken: string = '181792531.6b419d3.301f178d7c9c458ba5fc5ba3aff62843';
    
    console.log('Attempting to sign into Instagram');

    const IG_CLIENT_ID = '6b419d3888d54ed8aba9d3871c1ea0dc';
    const IG_ACCESS_TOKEN = '181792531.6b419d3.301f178d7c9c458ba5fc5ba3aff62843';

    console.log('Attempt init oAuth');
    cordovaOauth = new CordovaOauth(new Instagram({ 
      clientId: IG_CLIENT_ID, 
      appScope: ["basic, public_content"], 
      redirectUri: 'http://localhost/callback'
    }));
    console.log('Attempt sign into IG');

    cordovaOauth.login().then((success) => {
      console.log(JSON.stringify(success));
      igAccessToken = JSON.parse(JSON.stringify(success)).access_token;
      console.log('Got access token: ' + igAccessToken);
      // TODO store access token and load image
    }, (error) => {
      console.log(JSON.stringify(error));
      console.log('Skipping images');
    });

    // this.http.get(`https://api.instagram.com/v1/media/${id}?access_token=${this.accessToken}`)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     this.images = data.data.images;
    //   });
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
