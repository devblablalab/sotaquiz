import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioSrc : string = '';

  constructor() { }

  public changeAudioSrc(letter : string) {
    this.audioSrc = `assets/audio-quiz/sotaquiz-${letter}.ogg`;;
  }

  public getAudioSrc() {
    return this.audioSrc;
  }
}
