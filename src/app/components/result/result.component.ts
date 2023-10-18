import { Component, OnInit } from '@angular/core';
import { QuizCorrectQuestions } from 'src/app/interfaces/quiz';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  public correctAnswers : QuizCorrectQuestions[] | [] = [];
  public ufList : any = [];
    constructor(private service : QuizService) { }

  async ngOnInit() {
    this.service.protectQuizRoute();
    this.ufList = await this.service.setDataUfs();
    this.correctAnswers = this.service.getCorrectAnswers();
  }

  public checkUfItemIsCorrect(uf : string) {
    return this.correctAnswers.find(answer => answer.answerValue === uf.toLowerCase()) !== undefined;
  }
}
