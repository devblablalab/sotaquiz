import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioSrc : string = '';

  constructor() { }

  changeAudioSrc(letter : string) {
    this.audioSrc = `assets/audio-quiz/sotaquiz-${letter}.ogg`;;
  }

  getAudioSrc() {
    return this.audioSrc;
  }
}
