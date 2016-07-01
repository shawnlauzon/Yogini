import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProgramProvider } from '../../providers/program-provider/program-provider';

/*
  Generated class for the ProgramOverviewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/program-overview/program-overview.html',
  providers: [ProgramProvider]
})
export class ProgramOverviewPage {
  programInfo: any;	// Just the metadata from the index file
  program: any;		// All the program info from the program file

  constructor(public programProvider: ProgramProvider,
  	private nav: NavController, navParams: NavParams) {
  	this.programInfo = navParams.get('item');

  	this.programProvider.loadProgram(this.programInfo.id).then((program) => {
  		this.program = program;
  	});
  }
}
