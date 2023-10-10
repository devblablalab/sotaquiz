import { Component, OnInit, inject } from '@angular/core';
import { collection, getFirestore } from 'firebase/firestore';
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

  checkQuestionStatus() : void {
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
      firstSelected.dataset['letterAnswer']= this.listOfLetters[this.currentQuestion];
      firstSelected.disabled = true;
    } else {
      const lastSelected = document.querySelector('[data-question="0"].active-uf') as HTMLButtonElement;
      if(lastSelected) {
        lastSelected.dataset['question']= this.currentQuestion.toString();
        lastSelected.dataset['letterAnswer']= this.listOfLetters[this.currentQuestion];
        lastSelected.disabled = true;
      }
    }
  }

  prevQuestion() : void {
    this.currentQuestion--;
    this.audioService.changeAudioSrc(this.listOfLetters[this.currentQuestion]);
    this.checkQuestionStatus();
  }

  nextQuestion() : void {
    this.checkActiveAndSetAsData();
    this.currentQuestion++;
    this.audioService.changeAudioSrc(this.listOfLetters[this.currentQuestion]);
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
      if(active.dataset['letterAnswer']) active.removeAttribute('data-letter-answer');
    });
  }

  toggleUfOptions(e: Event): void {
    const currentTarget = e.currentTarget as HTMLElement;
    this.maintainingOneUf();
    currentTarget.classList.add('active-uf');
  }
}
