import { Injectable } from '@angular/core';
import { BackgroundsHeaderQuiz } from '../interfaces/quiz';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  public headerQuizBackgroundColors: string[] = ['#F24AFF','#FFCE00','#3BE25A'];
  public currentHeaderQuizColorIndex = 0;
  public currentHeaderQuizBackgroundColors : string  = '#F24AFF';
  
  constructor() { }

  public changeHeaderQuizBackgrounds() : string {
    this.currentHeaderQuizBackgroundColors = this.getUniqueHeaderQuizBackgroundColor();
    return this.currentHeaderQuizBackgroundColors;
  }

  public getUniqueHeaderQuizBackgroundColor() {
    this.currentHeaderQuizColorIndex++;
    const headerQuizBgLength = this.headerQuizBackgroundColors.length;
    if(this.currentHeaderQuizColorIndex >= headerQuizBgLength) {
      this.currentHeaderQuizColorIndex = 0;
    }
    return this.headerQuizBackgroundColors[this.currentHeaderQuizColorIndex];
  }
}
