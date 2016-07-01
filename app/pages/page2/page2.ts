import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProgramProvider } from '../../providers/program-provider/program-provider';
import { ProgramOverviewPage } from '../program-overview/program-overview';

@Component({
  templateUrl: 'build/pages/page2/page2.html',
  providers: [ProgramProvider]
})
export class Programs {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

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
          note: "Provided by " + element.creator,
          icon: 'rose'
        });
      });

      console.log(index);
    });
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.nav.push(ProgramOverviewPage, {
      item: item
    });
  }
}
