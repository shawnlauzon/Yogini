import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProgramProvider } from '../../providers/program-provider/program-provider';
import { ProgramOverviewPage } from '../program-overview/program-overview';
import { AudioPlayer } from '../../components/audio-player/audio-player';

@Component({
  templateUrl: 'build/pages/program-list/program-list.html',
  directives: [AudioPlayer],
  providers: [ProgramProvider]
})
export class ProgramListPage {
  selectedItem: any;
  items: Array<{title: string, note: string, icon: string, id: string}>;

  constructor(public programProvider: ProgramProvider, 
    private nav: NavController, navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Loop through all the programs in the index
    this.programProvider.loadIndex().then((index) => {
      this.items = [];
      index.programs.forEach((element, index, array) => {
        this.items.push({
          title: element.name,
          note: `Provided by ${element.creator}`,
          icon: 'rose',
          id: element.id
        });
      });
    });
  }

  itemTapped(event, item) {
    this.nav.push(ProgramOverviewPage, {
      item: item
    });
  }
}
