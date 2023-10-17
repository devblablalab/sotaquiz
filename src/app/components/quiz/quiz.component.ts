import { Component, ElementRef, OnInit } from '@angular/core';
import { QuestionUsage, QuestionUsageAudioCount, QuizQuestionList } from 'src/app/interfaces/quiz';
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
  public listOfAudioUsagePerQuestion : Array<QuestionUsageAudioCount> = [];
  
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

  private toggleQuestionOptions(currentElement : HTMLButtonElement) {
    if(currentElement.classList.contains('active-uf')) {
      this.setDefaultQuestionOptions(currentElement);
    } else {
      this.unsetDefaultQuestionOptions(currentElement);
    }
  }

  private setDefaultQuestionOptions(element : HTMLButtonElement) {
    element.dataset['question']= this.currentQuestion.toString();
    element.dataset['letterAnswer']= this.listOfLetters[this.currentQuestion - 1];
  }

  private unsetDefaultQuestionOptions(element : HTMLButtonElement) {
    element.classList.remove('active-uf');
    element.dataset['question'] = '0';
    if(element.dataset['letterAnswer']) element.removeAttribute('data-letter-answer');
  }

  private setAnswerInPrev() {
    const questionAnswer = this.service.questionsList.find((answer : QuizQuestionList) => answer.question === this.currentQuestion);
    const btnAnswer = this.elementRef.nativeElement.querySelector(`[data-uf="${questionAnswer?.answerValue}"]`);
    btnAnswer.classList.add('active-uf');
    this.setDefaultQuestionOptions(btnAnswer);
  }

  private getDataOfAnswerBtn() : {uf: string, letterAnswer: string} | null {
    const btnAnswer = this.elementRef.nativeElement.querySelector(`[data-question="${this.currentQuestion - 1}"].active-uf`);
    if(btnAnswer && btnAnswer.dataset) {
      const { uf, letterAnswer } = btnAnswer.dataset;
      return {
        uf,letterAnswer
      };
    }
    return null;
  }

  private resetButtonsAnswers() {
    const btnsAnswers = this.elementRef.nativeElement.querySelectorAll(`.active-uf`);
    btnsAnswers.forEach((btn : HTMLButtonElement ) => this.unsetDefaultQuestionOptions(btn));
  }

  private setListQuestionsData(uf : string, letterAnswer : string) {
    this.service.questionsList[this.currentQuestion - 2] = {
      question: this.currentQuestion - 1,
      answerValue: uf,
      isCorrect: this.service.checkCorrectAnswer(uf,letterAnswer)
    }
  }

  private setUsageDataItem() {
    this.listOfUsagePerQuestion[this.currentQuestion - 2] = {
      question: this.currentQuestion - 1,
      isAnswered : this.elementRef.nativeElement.querySelector(`[data-question="${this.currentQuestion - 1}"]`) 
      !== null,
      nextCount: this.listOfUsagePerQuestion[this.currentQuestion - 1]?.nextCount ? this.listOfUsagePerQuestion[this.currentQuestion - 1].nextCount + 1 : 1,
      audioCount: 0
    }
  }

  private setUsageDataLastItem() {
    this.listOfUsagePerQuestion[this.currentQuestion - 1] = {
      question: this.currentQuestion,
      isAnswered : this.elementRef.nativeElement.querySelector(`[data-question="${this.currentQuestion - 1}"]`) !== null,
      nextCount: 0,
      audioCount: 0
    }
  }

  public setAudioUsageData(e : Event) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('play-icon-handler') || target.closest('.play-icon-handler') !== null) {
      this.listOfAudioUsagePerQuestion[this.currentQuestion - 1] = {
        question: this.currentQuestion,
        audioCount: this.listOfAudioUsagePerQuestion[this.currentQuestion - 1]?.audioCount ? this.listOfAudioUsagePerQuestion[this.currentQuestion - 1].audioCount + 1 : 1,
      }
    }
  }

  public setAllAudiosToUsageData() {
    if(this.listOfAudioUsagePerQuestion.length > 0) {
      this.listOfAudioUsagePerQuestion.forEach((item,key) => {
        if(this.listOfUsagePerQuestion[key]) {
          this.listOfUsagePerQuestion[key]['audioCount'] = item.audioCount;
        }
      });
    }
  }

  public prevQuestion() : void {
    this.currentQuestion--;
    this.audioService.changeSrcAndResetAudioTime(this.listOfLetters[this.currentQuestion - 1]);
    this.checkQuestionStatus();
    this.setAnswerInPrev();
  }

  public nextQuestion() : void {
    this.currentQuestion++;
    this.audioService.changeSrcAndResetAudioTime(this.listOfLetters[this.currentQuestion - 1]);
    this.checkQuestionStatus();
    this.setUsageDataItem();
    const answerData = this.getDataOfAnswerBtn();
    if(answerData) {
      const { uf, letterAnswer } = answerData;
      this.setListQuestionsData(uf,letterAnswer);
    }
    this.resetButtonsAnswers();
  }

  private maintainingOneAnswer(currentElement : HTMLButtonElement) {
    const activeButtons = this.elementRef.nativeElement.querySelectorAll('.active-uf');
    activeButtons.forEach((active : HTMLButtonElement) => {
      if(active !== currentElement) this.unsetDefaultQuestionOptions(active);
    });
  }

  public toggleUfOptions(e: Event): void {
    const currentTarget = e.currentTarget as HTMLButtonElement;
    currentTarget.classList.toggle('active-uf') 
    this.toggleQuestionOptions(currentTarget);
    this.maintainingOneAnswer(currentTarget)
  }

  public sendQuiz() {
    this.service.quizIsFinished = true;
    this.setUsageDataLastItem();
    this.setAllAudiosToUsageData();
    this.service.sendStateCounters();
    this.service.sendUsageData(this.listOfUsagePerQuestion);
    this.service.sendFinishQuiz();
  }
}
