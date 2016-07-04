import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { CordovaOauth, Instagram } from 'ng2-cordova-oauth/core';
import { ImgurProvider } from '../../providers/imgur-provider/imgur-provider';
import { AudioPlayer } from '../../components/audio-player/audio-player';
import { Program, Asana, SequenceItem } from '../../providers/program-provider/program-provider';

// This is how to use something pulled from a script without typings defined
// declare var SC: any;

/*
  Generated class for the AsanaPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/asana/asana.html',
  directives: [AudioPlayer, Slides],
  providers: [ImgurProvider]
})
export class AsanaPage {
  @ViewChildren(AudioPlayer) audio: QueryList<AudioPlayer>;
  @ViewChild(Slides) slider: Slides;

  // FIXME Yuck this should be Array<AudioPlayer>. I get a copy
  // of the QueryList because there's no way to access an element by index
  audioArray: any;

  program: Program;

  private curAsana: number = 0;
  private curSequenceItem: number = 0;

  private intervalId;

  mySlideOptions = {
    direction: 'vertical'
  };

  constructor(private imgur: ImgurProvider, private nav: NavController,
    private navParams: NavParams) {

    this.program = navParams.get('program');
    this.resolveImageUrls();

    for (let i = 0; i < this.program.asanas.length; i++) {
      this.program.asanas[i].timeRemaining = this.getTimeRemaining(
        this.program.asanas[i].sequence[0].wait);
    }
  }

  resolveImageUrls() {
    for (let i = 0; i < this.program.asanas.length; i++) {
      let element = this.program.asanas[i];
      if (element.image) {
        this.imgur.get(element.image).then(data => {
          element.imageSrc = data.link;
        });
      } else {
        element.imageSrc = "";
      }
    };
  }

  ngAfterViewInit() {
    this.audioArray = this.audio.toArray();

    // If we aren't starting at the first asana
    console.log(this.slider);

    // debugger;
    // this.slider.slideTo(this.curAsana);

    this.playAudio();
  }

  playAudio() {
    this.audioArray[this.curAsana].load(this.getCurrentSequenceItem().audio)
      .then(result => {
        this.audioArray[this.curAsana].play(this.newAudioCompletionListener());
      });
  }

  getCurrentSequenceItem(): SequenceItem {
    return this.getCurrentAsana().sequence[this.curSequenceItem]
  }

  getCurrentAsana(): Asana {
    return this.program.asanas[this.curAsana];
  }

  getTimeRemaining(secRemaining: number): string {
    var min = Math.floor(secRemaining / 60);
    var sec = Math.floor(secRemaining % 60);
    return min + ':' + (sec < 10 ? '0' + sec : sec);
  }

  wait() {
    var secRemaining = this.getCurrentSequenceItem().wait;
    var _this = this;

    // FIXME Handle pause pressed while interval is active
    _this.intervalId = setInterval(function () {
      secRemaining -= 1;
      if (secRemaining > 0) {
        _this.getCurrentAsana().timeRemaining = _this.getTimeRemaining(secRemaining);
        console.log("update time to " + _this.getCurrentAsana().timeRemaining);
      } else {
        clearInterval(_this.intervalId);
        _this.advance();
      }
    }, 1000);
  }

  advance() {
    this.curSequenceItem += 1;
    if (this.program.asanas[this.curAsana].sequence.length <= this.curSequenceItem) {
      this.curAsana += 1;
      this.curSequenceItem = 0;
      this.slider.slideTo(this.curAsana);
    }

    this.getCurrentAsana().timeRemaining = this.getTimeRemaining(this.getCurrentSequenceItem().wait);
    this.playAudio();
  }

  newAudioCompletionListener() {
    // Store the pointer to this because when executed, `this` will become
    // the current execution point
    var _this: AsanaPage = this;
    return function () {
      console.log('audio finished.');

      _this.wait();
    };
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
}
