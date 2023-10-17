import { Component, ElementRef, OnInit } from '@angular/core';
import { QuestionUsage } from 'src/app/interfaces/quiz';
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
  public listOfUsagePerQuestion : Array<QuestionUsage> = [];
  public listOfSelectedQuestion : Array<Object> = [];
  
  constructor(
    private service : QuizService, 
    private audioService : AudioService, 
    private elementRef : ElementRef
  ) {
    this.listOfLetters = this.service.listOfLetters;
    this.audioService.changeAudioSrc(this.listOfLetters[this.currentQuestion - 1]);
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
      const firstSelected = this.elementRef.nativeElement.querySelector('.active-uf') as HTMLButtonElement;
      firstSelected.dataset['question']= this.currentQuestion.toString();
      firstSelected.dataset['letterAnswer']= this.listOfLetters[this.currentQuestion - 1];
      firstSelected.disabled = true;
    } else {
      this.setLastQuestionOptions();
    }
  }

  private setLastQuestionOptions() {
    const lastSelected = this.elementRef.nativeElement.querySelector('[data-question="0"].active-uf') as HTMLButtonElement;
    if(lastSelected) {
      lastSelected.dataset['question']= this.currentQuestion.toString();
      lastSelected.dataset['letterAnswer']= this.listOfLetters[this.currentQuestion - 1];
      lastSelected.disabled = true;
    }
  }

  private unsetDefaultQuestionOptions(element : HTMLButtonElement) {
    element.classList.remove('active-uf');
    element.dataset['question'] = '0';
    element.disabled = false;
    if(element.dataset['letterAnswer']) element.removeAttribute('data-letter-answer');
  }

  private setUsageDataItem() {
    this.listOfUsagePerQuestion[this.currentQuestion - 2] = {
      question: this.currentQuestion - 1,
      isAnswered : this.elementRef.nativeElement.querySelector(`[data-question="${this.currentQuestion - 1}"]`) 
      !== null,
      nextCount: this.listOfUsagePerQuestion[this.currentQuestion - 1]?.nextCount ? this.listOfUsagePerQuestion[this.currentQuestion - 1].nextCount + 1 : 1
    }
  }

  private setUsageDataLastItem() {
    this.listOfUsagePerQuestion[this.currentQuestion - 1] = {
      question: this.currentQuestion,
      isAnswered : this.elementRef.nativeElement.querySelector(`[data-question="${this.currentQuestion - 1}"]`) !== null,
      nextCount: 0
    }
  }

  public prevQuestion() : void {
    this.currentQuestion--;
    this.audioService.changeSrcAndResetAudioTime(this.listOfLetters[this.currentQuestion - 1]);
    this.checkQuestionStatus();
  }

  public nextQuestion() : void {
    this.checkActiveAndSetAsData();
    this.currentQuestion++;
    this.audioService.changeSrcAndResetAudioTime(this.listOfLetters[this.currentQuestion - 1]);
    this.checkQuestionStatus();
    this.setUsageDataItem();
  }

  private maintainingOneAnswer(currentElement : HTMLButtonElement) {
    const resetedButtons = this.elementRef.nativeElement.querySelectorAll('[data-question="0"].active-uf');
    const changedButtonsInQuestion = this.elementRef.nativeElement.querySelectorAll(`[data-question="${this.currentQuestion}"]`);
    const elementsToReset = new Set([...resetedButtons, ...changedButtonsInQuestion]);

    if(elementsToReset.size > 0) {
      const [element] = elementsToReset;
      if(element === currentElement) {
        return false;
      }
    }

    elementsToReset.forEach((active : HTMLButtonElement) => {
      this.unsetDefaultQuestionOptions(active);
    });

    return true;
  }

  public toggleUfOptions(e: Event): void {
    const currentTarget = e.currentTarget as HTMLButtonElement;
    if(this.maintainingOneAnswer(currentTarget)) currentTarget.classList.add('active-uf')  
    else currentTarget.classList.remove('active-uf');

    if(this.isMaxQuestion) {
      this.setLastQuestionOptions();
    }
  }

  public sendQuiz() {
    this.setUsageDataLastItem();
    const answersBtns = this.elementRef.nativeElement.querySelectorAll('[data-letter-answer].active-uf');
    this.service.setQuizSendData(Array.from(answersBtns) as HTMLButtonElement[]);
    this.service.sendStateCounters();
    this.service.sendUsageData(this.listOfUsagePerQuestion);
    this.service.sendFinishQuiz();
  }
}
