import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-confirm-quiz',
  templateUrl: './confirm-quiz.component.html',
  styleUrls: ['./confirm-quiz.component.scss']
})
export class ConfirmQuizComponent implements OnInit {
  constructor(private service : QuizService) { }

  ngOnInit() {
    this.service.protectQuizRoute();
  }

  public goToQuiz() {
    this.service.quizResultPrev = true;
  }

  public sendQuiz() {
    this.service.sendQuizData();
  }
}
