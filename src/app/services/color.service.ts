import { Injectable } from '@angular/core';
import { BackgroundsHeaderQuiz } from '../interfaces/quiz';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  public headerQuizBackgroundColors: Array<BackgroundsHeaderQuiz> = [
    { header:'#000',slider:'#FFF' },
    { header:'#FFF',slider:'#000' },
    { header:'#FFF0',slider:'#CCC' }
  ];
  public currentHeaderQuizBackgroundColors : BackgroundsHeaderQuiz = {
    header:'#F24AFF',slider:'#000'
  };
  
  constructor() { }

  public changeHeaderQuizBackgrounds() {
    this.currentHeaderQuizBackgroundColors = this.getUniqueBackgroundObjectFromArray();
  }

  public getUniqueBackgroundObjectFromArray() : BackgroundsHeaderQuiz {
    let lastRandomIndex = -1;
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * this.headerQuizBackgroundColors.length);
    } while (randomIndex === lastRandomIndex);

    lastRandomIndex = randomIndex;
    return this.headerQuizBackgroundColors[randomIndex];
  }
}
