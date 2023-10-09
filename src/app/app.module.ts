import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { BrandComponent } from './components/header/brand/brand.component';
import { HomeComponent } from './components/home/home.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { UserRoundedBoldIcon } from './components/icons/bold/user/user-rounded.component';
import { UserBorderedBoldIcon } from './components/icons/bold/user/user-bordered.component';
import { UserSquareBoldIcon } from './components/icons/bold/user/user-square.component';
import { ShapeContentComponent } from './components/shape-content/shape-content.component';
import { ConfirmQuizComponent } from './components/confirm-quiz/confirm-quiz.component';
import { UserRoundedIcon } from './components/icons/normal/user/user-rounded.component';
import { ResultComponent } from './components/result/result.component';
import { ShareComponent } from './components/icons/normal/share/share.component';

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
    ShareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
