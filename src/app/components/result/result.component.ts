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
  public resultImage : string = "";
  constructor(private service : QuizService) { }

  async ngOnInit() {
    this.service.protectQuizRoute();
    this.ufList = await this.service.setDataUfs();
    this.correctAnswers = this.service.getCorrectAnswers();
    this.resultImage = this.getResultImage();

  }

  public checkUfItemIsCorrect(uf : string) {
    return this.correctAnswers.find(answer => answer.answerValue === uf.toLowerCase()) !== undefined;
  }

  public getResultImage() {
    if(this.correctAnswers.length < 10){
      return "/assets/shapes/bad-result.svg";
    } else if(this.correctAnswers.length < 20) {
      return "/assets/shapes/medium-result.svg";
    } else {
      return "/assets/shapes/good-result.svg";
    }
  }
}
