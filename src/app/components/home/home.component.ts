import { Component } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public iconBorderedClass = 'fill-icon-primary';

  constructor(private quizService: QuizService) {}

  sendStartQuizData() {
    this.quizService.sendStartQuiz();
  }
}
