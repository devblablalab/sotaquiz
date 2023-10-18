import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioSrc : string = '';
  public currentTime: number = 0;
  public volume = 50;
  public timeUpdateSubscription!: Subscription;
  public isPlaying : boolean = false;
  public audioPlayer = new Audio();

  constructor() { }

  public changeAudioSrc(letter : string) {
    this.audioSrc = `assets/audio-quiz/sotaquiz-${letter}.wav`;
    this.audioPlayer.src = this.audioSrc;
    this.audioPlayer.load();  
  }

  public getAudioSrc() {
    return this.audioSrc;
  }

  public resetAudioPlayerTime() {
    this.audioPlayer.currentTime = 0;
  }

  public changeSrcAndResetAudioTime(letter: string) {
    this.changeAudioSrc(letter);
    this.isPlaying = false;
    this.resetAudioPlayerTime();
  }

  public playAudio() {
    this.audioPlayer.src = this.getAudioSrc();
    this.audioPlayer.load();
    if (this.audioPlayer.paused) {
      this.audioPlayer.currentTime = this.currentTime;
    } else {
      this.currentTime = 0;
    }
    this.audioPlayer.play();
  }
}
