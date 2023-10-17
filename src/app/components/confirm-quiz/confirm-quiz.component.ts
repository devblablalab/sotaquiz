import { Component } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-confirm-quiz',
  templateUrl: './confirm-quiz.component.html',
  styleUrls: ['./confirm-quiz.component.scss']
})
export class ConfirmQuizComponent {
  constructor(private quizService: QuizService) { }
}
