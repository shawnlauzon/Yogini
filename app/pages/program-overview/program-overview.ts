import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ProgramOverviewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/program-overview/program-overview.html',
})
export class ProgramOverviewPage {
  item: any;

  constructor(private nav: NavController, navParams: NavParams) {
  	this.item = navParams.get('item');
  	console.log(this.item);
  }
}
