import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundsHeaderQuiz, QuizQuestionList } from 'src/app/interfaces/quiz';
import { AudioService } from 'src/app/services/audio.service';
import { ColorService } from 'src/app/services/color.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  public ufList : any = [];
  public listOfLetters : Array<string> = [];
  public audioUfSrc : string = '';
  public isMaxQuestion : boolean = false;
  public currentHeaderQuizBg : BackgroundsHeaderQuiz | null = null;
  
  constructor(
    public service : QuizService, 
    private audioService : AudioService,
    private colorService : ColorService, 
    private elementRef : ElementRef,
    private router : Router
  ) {
    this.listOfLetters = this.service.listOfLetters;
    this.audioService.changeAudioSrc(this.listOfLetters[this.service.currentQuestion - 1]);
    this.currentHeaderQuizBg = this.colorService.currentHeaderQuizBackgroundColors;
  }

  async ngOnInit()  {
    this.ufList = await this.service.setDataUfs();
    if(this.service.quizResultPrev) {
      this.service.currentQuestion = 1;
      this.checkQuestionStatus();
    }
  }

  public checkQuizBackHasLast(uf : string) {
    return this.service.quizResultPrev 
    && this.service.questionsList[this.listOfLetters.length - 1] !== undefined
    && this.service.questionsList[this.listOfLetters.length - 1]?.answerValue === uf.toLowerCase();
  }

  private checkQuestionStatus() : void {
    if(this.service.currentQuestion > this.ufList.length) {
      this.isMaxQuestion = true;
    } else {
      this.isMaxQuestion = false;
    }

    if(this.service.currentQuestion <= (this.ufList.length - this.ufList.length)) {
      this.service.currentQuestion = 1;
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
    element.dataset['question']= this.service.currentQuestion.toString();
    element.dataset['letterAnswer']= this.listOfLetters[this.service.currentQuestion - 1];
  }

  private unsetDefaultQuestionOptions(element : HTMLButtonElement) {
    element.classList.remove('active-uf');
    element.dataset['question'] = '0';
    if(element.dataset['letterAnswer']) element.removeAttribute('data-letter-answer');
  }

  private setAnswerInPrevNext() {
    const questionAnswer = this.service.questionsList.find((answer : QuizQuestionList) => answer?.question === this.service.currentQuestion);
    this.resetButtonsAnswers();
    const btnAnswer = this.elementRef.nativeElement.querySelector(`[data-uf="${questionAnswer?.answerValue}"]`);
    if(btnAnswer) {
      btnAnswer.classList.add('active-uf');
      this.setDefaultQuestionOptions(btnAnswer);
    }
  }

  private getDataOfAnswerBtn(index : number) : {uf: string, letterAnswer: string} | null {
    const btnAnswer = this.elementRef.nativeElement.querySelector(`[data-question="${index}"].active-uf`);
    if(btnAnswer && btnAnswer.dataset && btnAnswer.classList.contains('active-uf')) {
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
    this.service.questionsList[this.service.currentQuestion - 2] = {
      question: this.service.currentQuestion - 1,
      answerValue: uf,
      isCorrect: this.service.checkCorrectAnswer(uf,letterAnswer)
    }
  }

  private setUsageDataItem() {
    this.service.listOfUsagePerQuestion[this.service.currentQuestion - 2] = {
      question: this.service.currentQuestion - 1,
      isAnswered : this.elementRef.nativeElement.querySelector(`[data-question="${this.service.currentQuestion - 1}"]`) 
      !== null,
      nextCount: this.service.listOfUsagePerQuestion[this.service.currentQuestion - 1]?.nextCount ? this.service.listOfUsagePerQuestion[this.service.currentQuestion - 1].nextCount + 1 : 1,
      audioCount: 0
    }
  }

  public setAudioUsageData(e : Event) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('play-icon-handler') || target.closest('.play-icon-handler') !== null) {
      this.service.listOfAudioUsagePerQuestion[this.service.currentQuestion - 1] = {
        question: this.service.currentQuestion,
        audioCount: this.service.listOfAudioUsagePerQuestion[this.service.currentQuestion - 1]?.audioCount ? this.service.listOfAudioUsagePerQuestion[this.service.currentQuestion - 1].audioCount + 1 : 1,
      }
    }
  }

  public prevQuestion() : void {
    if(this.service.currentQuestion === 1) return;
    this.service.currentQuestion--;
    this.audioService.changeSrcAndResetAudioTime(this.listOfLetters[this.service.currentQuestion - 1]);
    this.checkQuestionStatus();
    this.setAnswerInPrevNext();
  }

  public nextQuestion() : void {
    this.service.currentQuestion++;
    this.audioService.changeSrcAndResetAudioTime(this.listOfLetters[this.service.currentQuestion - 1]);
    if(!this.audioService.isPlaying) this.audioService.isPlaying = true;
    this.audioService.playAudio();
    this.audioService.resetAudioPlayerTime();

    this.checkQuestionStatus();
    this.setUsageDataItem();
    const answerData = this.getDataOfAnswerBtn(this.service.currentQuestion - 1);
    if(answerData) {
      const { uf, letterAnswer } = answerData;
      this.setListQuestionsData(uf,letterAnswer);
    }
    this.setAnswerInPrevNext();
    if(this.isMaxQuestion) {
      this.service.currentQuestion = this.ufList.length;
      this.service.quizIsFinished = true;
      this.service.quizResultPrev = false;
      this.audioService.audioPlayer.pause();
      this.router.navigate(['/confirm-quiz']);
    }
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
    this.maintainingOneAnswer(currentTarget);
  }
}
