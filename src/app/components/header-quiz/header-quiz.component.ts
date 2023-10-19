import { Component, Input } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-header-quiz',
  templateUrl: './header-quiz.component.html',
  styleUrls: ['./header-quiz.component.scss']
})
export class HeaderQuizComponent {
  @Input() questionsLength!: number;
  constructor(public quizService: QuizService) {}

  public formatQuestionNumber(currentQuestion : number) {
    return currentQuestion.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  }
}
