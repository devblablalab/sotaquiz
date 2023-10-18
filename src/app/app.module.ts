import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ConfirmQuizComponent } from './components/confirm-quiz/confirm-quiz.component';
import { BrandComponent } from './components/header/brand/brand.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { HomeComponent } from './components/home/home.component';
import { UserBorderedBoldIcon } from './components/icons/bold/user/user-bordered.component';
import { UserRoundedBoldIcon } from './components/icons/bold/user/user-rounded.component';
import { UserSquareBoldIcon } from './components/icons/bold/user/user-square.component';
import { ShareComponent } from './components/icons/normal/share/share.component';
import { UserRoundedIcon } from './components/icons/normal/user/user-rounded.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { ShapeContentComponent } from './components/shape-content/shape-content.component';
import { AppRoutingModule } from './modules/app-routing.module';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from '../environments/environment';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { AudioVolumeIcon } from './components/icons/normal/audio/volume.component';
import { AudioPlayIcon } from './components/icons/normal/audio/play.component';
import { AudioPauseIcon } from './components/icons/normal/audio/pause.component';
import { HeaderQuizComponent } from './components/header-quiz/header-quiz.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogoComponent,
    BrandComponent,
    HomeComponent,
    QuizComponent,
    UserRoundedBoldIcon,
    UserBorderedBoldIcon,
    UserSquareBoldIcon,
    UserRoundedIcon,
    ShapeContentComponent,
    ConfirmQuizComponent,
    ResultComponent,
    ShareComponent,
    AudioPlayerComponent,
    AudioVolumeIcon,
    AudioPlayIcon,
    AudioPauseIcon,
    HeaderQuizComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    firebase.initializeApp(environment.firebase);
  }
 }
