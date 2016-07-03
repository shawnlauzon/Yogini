import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProgramProvider } from '../../providers/program-provider/program-provider';
import { ProgramOverviewPage } from '../program-overview/program-overview';
import { AudioPlayer } from '../../components/audio-player/audio-player';
import { ImgurProvider } from '../../providers/imgur-provider/imgur-provider';

@Component({
  templateUrl: 'build/pages/program-list/program-list.html',
  directives: [AudioPlayer],
  providers: [ProgramProvider, ImgurProvider]
})
export class ProgramListPage {
  selectedItem: any;
  items: Array<{ title: string, note: string, image: string, id: string }>;

  constructor(
    private programProvider: ProgramProvider,
    private imgur: ImgurProvider,
    private nav: NavController,
    private navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Loop through all the programs in the index
    this.programProvider.loadIndex().then((index) => {
      this.items = [];
      index.programs.forEach((element, index, array) => {
        let item = {
          title: element.name,
          note: `Provided by ${element.creator}`,
          image: "",
          id: element.id
        };
        // Set the image after it's loaded by ImgurProvider
        imgur.get(element.image_ur).then(image_data => {
          item.image = image_data.link;
        });
        this.items.push(item);
      });
    });
  }

  itemTapped(event, item) {
    this.nav.push(ProgramOverviewPage, {
      item: item
    });
  }
}
