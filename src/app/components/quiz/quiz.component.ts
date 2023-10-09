import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  public ufList : Array<string> = [];
  public currentQuestion : number = 1;
  public audioUfSrc : string = `assets/audiotest${this.currentQuestion}.ogg`;
  public isMaxQuestion : boolean = false;
  public listOfSelectedQuestion : Array<Object> = [];
  constructor(private service : QuizService) {}

  ngOnInit(): void {
      this.ufList = this.service.getUfOptions();
  }

  checkQuestionStatus() : void {
    this.audioUfSrc = `assets/audiotest${this.currentQuestion}.ogg`;
    if(this.currentQuestion >= this.ufList.length) {
      this.isMaxQuestion = true;
    } else {
      this.isMaxQuestion = false;
    }

    if(this.currentQuestion <= (this.ufList.length - this.ufList.length)) {
      this.currentQuestion = 1;
    }
  }

  checkActiveAndSetAsData() : void {
    if(this.currentQuestion === 0) {
      const firstSelected = document.querySelector('.active-uf') as HTMLButtonElement;
      firstSelected.dataset['question']= this.currentQuestion.toString();
      firstSelected.disabled = true;
    } else {
      const lastSelected = document.querySelector('[data-question="0"].active-uf') as HTMLButtonElement;
      if(lastSelected) {
        lastSelected.dataset['question']= this.currentQuestion.toString();
        lastSelected.disabled = true;
      }
    }
  }

  prevQuestion() : void {
    this.currentQuestion--;
    this.checkQuestionStatus();
  }

  nextQuestion() : void {
    this.checkActiveAndSetAsData();
    this.currentQuestion++;
    this.checkQuestionStatus();
  }

  maintainingOneUf() : void {
    const resetedButtons = Array.from(document.querySelectorAll('[data-question="0"].active-uf')) as HTMLButtonElement[];
    const changedButtonsInQuestion = Array.from(document.querySelectorAll(`[data-question="${this.currentQuestion}"]`)) as HTMLButtonElement[];
    const elementsToReset = new Set([...resetedButtons, ...changedButtonsInQuestion]);
  
    elementsToReset.forEach((active : HTMLButtonElement) => {
      active.classList.remove('active-uf');
      active.dataset['question'] = '0';
      active.disabled = false;
    });
  }

  toggleUfOptions(e: Event): void {
    const currentTarget = e.currentTarget as HTMLElement;
    this.maintainingOneUf();
    currentTarget.classList.add('active-uf');
  }
}
