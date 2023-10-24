import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { QuizCorrectQuestions, QuizQuestions } from 'src/app/interfaces/quiz';
import { AudioService } from 'src/app/services/audio.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  public questionAnswers : QuizQuestions[] = [];
  public correctAnswers : QuizCorrectQuestions[] | [] = [];
  public ufList : any = [];
  public resultImage : string = "";
  public ufButtons : HTMLButtonElement[] = [];
  
  constructor(
    private service : QuizService, 
    private audioService : AudioService, 
    private elementRef : ElementRef,
    private renderer : Renderer2
    ) { }


  async ngOnInit() {
    this.service.protectQuizRoute();
    this.ufList = await this.service.setDataUfs();
    this.correctAnswers = this.service.getCorrectAnswers();
    this.questionAnswers = await this.service.getQuestionsAnswers();
    this.ufButtons = this.elementRef.nativeElement.querySelectorAll('.ufs button');
  }

  public getLetterByUf(uf : string) {
    return this.questionAnswers.find(answer => answer.correctValue === uf.toLowerCase())?.audioLetter;
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

  public removeAllActiveAudioBtnsUf(currentTarget : HTMLButtonElement) {
    console.log(this.ufButtons);
    this.ufButtons?.forEach((button : HTMLButtonElement) => {
      if (button !== currentTarget) this.renderer.removeClass(button, 'active-play-uf');
    });
  }

  public handleAudioCurrentUf(e : Event) {
    const currentTarget = e.currentTarget as HTMLButtonElement;
    this.removeAllActiveAudioBtnsUf(currentTarget);

    currentTarget.classList.toggle('active-play-uf');
    const currentLetter = currentTarget.dataset['letter'];
    if(currentTarget.classList.contains('active-play-uf')) {
      this.audioService.changeAudioSrc(currentLetter!);
      this.audioService.playAudio();
      this.audioService.triggerAudioEndedListener(() => currentTarget.classList.remove('active-play-uf'));
    } else {
      this.audioService.resetPlayerAudio();
      this.audioService.pauseAudio();
    }
  }
}
