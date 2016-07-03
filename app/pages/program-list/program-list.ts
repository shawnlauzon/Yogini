import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProgramProvider } from '../../providers/program-provider/program-provider';
import { ProgramOverviewPage } from '../program-overview/program-overview';
import { AudioPlayer } from '../../components/audio-player/audio-player';
import { ImgurProvider } from '../../providers/imgur-provider/imgur-provider';
import { Index, ProgramInfo } from '../../providers/program-provider/program-provider';

@Component({
  templateUrl: 'build/pages/program-list/program-list.html',
  directives: [AudioPlayer],
  providers: [ProgramProvider, ImgurProvider]
})
export class ProgramListPage {
  selectedItem: any;
  programs: Array<ProgramInfo> = [];

  constructor(
    private programProvider: ProgramProvider,
    private imgur: ImgurProvider,
    private nav: NavController,
    private navParams: NavParams) {

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.programProvider.loadIndex().then((index) => {
      this.programs = index.programs;
      this._resolveImageUrls();
    });
  }

  _resolveImageUrls() {
    for (let i = 0; i < this.programs.length; i++) {
      let element = this.programs[i];
      if (element.image) {
        this.imgur.get(element.image).then(image_data => {
          element.imageSrc = image_data.link;
        });
      }
    }
  }

  itemTapped(event, programInfo: ProgramInfo) {
    this.nav.push(ProgramOverviewPage, {
      programInfo: programInfo
    });
  }
}
