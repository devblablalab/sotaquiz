import { Component, Input } from '@angular/core';
import { BackgroundsHeaderQuiz } from 'src/app/interfaces/quiz';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-header-quiz',
  templateUrl: './header-quiz.component.html',
  styleUrls: ['./header-quiz.component.scss']
})

export class HeaderQuizComponent {
  @Input() headerBackgroundColor : string = '';
  public backgroundColors : Array<BackgroundsHeaderQuiz> = [
    { header:'#000',slider:'#FFF' },
    { header:'#FFF',slider:'#000' },
    { header:'#FF00',slider:'#CCC' }
  ];
  public lastRandomIndex : number = -1;
  public currentBackgroundColors : BackgroundsHeaderQuiz = {
    header:'#F24AFF',slider:'#000'
  };

  constructor(private quizService : QuizService) { this.changeHeaderQuizBackgrounds() }

  public changeHeaderQuizBackgrounds() {
    const currentObjectBg = this.getUniqueBackgroundObjectFromArray();
    console.log(currentObjectBg);
  }

  public getUniqueBackgroundObjectFromArray() : BackgroundsHeaderQuiz {
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * this.backgroundColors.length);
    } while (randomIndex === this.lastRandomIndex);

    this.lastRandomIndex = randomIndex;

    return this.backgroundColors[randomIndex];
  }
}
