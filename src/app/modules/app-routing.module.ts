import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { QuizComponent } from '../components/quiz/quiz.component';
import { ConfirmQuizComponent } from '../components/confirm-quiz/confirm-quiz.component';
import { ResultComponent } from '../components/result/result.component';

const appRoutes : Routes = [
 { path: '', pathMatch:'full', redirectTo:'home' },
 { path: 'home', component: HomeComponent},
 { path: 'quiz', component: QuizComponent},
 { path: 'confirm-quiz', component: ConfirmQuizComponent},
 { path: 'result', component: ResultComponent},
];

@NgModule({
  imports:[RouterModule.forRoot(appRoutes)],
  exports:[RouterModule],
})
export class AppRoutingModule { }
