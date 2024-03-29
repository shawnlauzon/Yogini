import { Component, ViewChild } from '@angular/core';
import { App, ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { UserProfilePage } from './pages/user-profile/user-profile';
import { ProgramListPage } from './pages/program-list/program-list';

@Component({
  templateUrl: 'build/app.html'
})
class Yogini {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProgramListPage;

  pages: Array<{title: string, component: any}>

  constructor(private platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      // TODO The title of the UserProfile page should be the current user's name
      { title: 'John Smith', component: UserProfilePage },
      { title: 'Programs', component: ProgramListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(Yogini);
