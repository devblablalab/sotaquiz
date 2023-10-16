import { Component, OnInit } from '@angular/core';
import { DataSendQuiz } from 'src/app/interfaces/quiz';
import { AudioService } from 'src/app/services/audio.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  public ufList : any = [];
  public listOfLetters : Array<string> = [];
  public currentQuestion : number = 1;
  public audioUfSrc : string = '';
  public isMaxQuestion : boolean = false;
  public listOfSelectedQuestion : Array<Object> = [];
  
  constructor(private service : QuizService, private audioService : AudioService) {
    this.listOfLetters = this.service.listOfLetters;
    this.audioService.changeAudioSrc(this.listOfLetters[this.currentQuestion]);
  }

  async ngOnInit()  {
    this.ufList = await this.service.setDataUfs();
  }

  private checkQuestionStatus() : void {
    if(this.currentQuestion >= this.ufList.length) {
      this.isMaxQuestion = true;
    } else {
      this.isMaxQuestion = false;
    }

    if(this.currentQuestion <= (this.ufList.length - this.ufList.length)) {
      this.currentQuestion = 1;
    }
  }

  private checkActiveAndSetAsData() : void {
    if(this.currentQuestion === 0) {
      const firstSelected = document.querySelector('.active-uf') as HTMLButtonElement;
      firstSelected.dataset['question']= this.currentQuestion.toString();
      firstSelected.dataset['letterAnswer']= this.listOfLetters[this.currentQuestion];
      firstSelected.disabled = true;
    } else {
      this.setLastQuestionOptions();
    }
  }

  private setLastQuestionOptions() {
    const lastSelected = document.querySelector('[data-question="0"].active-uf') as HTMLButtonElement;
    if(lastSelected) {
      lastSelected.dataset['question']= this.currentQuestion.toString();
      lastSelected.dataset['letterAnswer']= this.listOfLetters[this.currentQuestion];
      lastSelected.disabled = true;
    }
  }

  public prevQuestion() : void {
    this.currentQuestion--;
    this.audioService.changeSrcAndResetAudioTime(this.listOfLetters[this.currentQuestion]);
    this.checkQuestionStatus();
  }

  public nextQuestion() : void {
    this.checkActiveAndSetAsData();
    this.currentQuestion++;
    this.audioService.changeSrcAndResetAudioTime(this.listOfLetters[this.currentQuestion]);
    this.checkQuestionStatus();
  }

  private maintainingOneUf() : void {
    const resetedButtons = Array.from(document.querySelectorAll('[data-question="0"].active-uf')) as HTMLButtonElement[];
    const changedButtonsInQuestion = Array.from(document.querySelectorAll(`[data-question="${this.currentQuestion}"]`)) as HTMLButtonElement[];
    const elementsToReset = new Set([...resetedButtons, ...changedButtonsInQuestion]);
  
    elementsToReset.forEach((active : HTMLButtonElement) => {
      active.classList.remove('active-uf');
      active.dataset['question'] = '0';
      active.disabled = false;
      if(active.dataset['letterAnswer']) active.removeAttribute('data-letter-answer');
    });
  }

  public toggleUfOptions(e: Event): void {
    const currentTarget = e.currentTarget as HTMLElement;
    this.maintainingOneUf();
    currentTarget.classList.add('active-uf');
    if(this.isMaxQuestion) {
      this.setLastQuestionOptions();
    }
  }

  public sendQuiz() {
    const answersBtns = document.querySelectorAll('[data-letter-answer].active-uf');
    this.service.setQuizSendData(Array.from(answersBtns) as HTMLButtonElement[]);
    this.service.sendStateCounters();
  }
}
