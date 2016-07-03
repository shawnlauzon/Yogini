import { Component } from '@angular/core';
import { NavController, NavParams, Modal } from 'ionic-angular';
import { ProgramProvider } from '../../providers/program-provider/program-provider';
import { AsanaPage } from '../asana/asana';
import { ImgurProvider } from '../../providers/imgur-provider/imgur-provider';

/*
  Generated class for the ProgramOverviewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/program-overview/program-overview.html',
  providers: [ProgramProvider, ImgurProvider]
})
export class ProgramOverviewPage {
  programInfo: any;	// Just the metadata from the index file
  program: any;		// All the program info from the program file

  image: string; // url of the image to display

  constructor(
    private programProvider: ProgramProvider,
    private imgur: ImgurProvider,
    private nav: NavController, 
    private navParams: NavParams) {

    this.programInfo = navParams.get('item');

    this.programProvider.loadProgram(this.programInfo.id).then((program) => {
      this.program = program;
    });
  }

  playPressed(event) {

    // FIXME For some reason the Modal gives an error about a messing directive
    // 	let asanaModal = Modal.create(AsanaPage, {
    // 	program: this.program
    // });

    // this.nav.push(asanaModal);

    this.nav.push(AsanaPage, {
      program: this.program
    });
  }
}
