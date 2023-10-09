import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioSrc : string = 'assets/audiotest1.ogg';

  constructor() { }

  changeAudioSrc(src : string) {
    this.audioSrc = src;
  }

  getAudioSrc() {
    return this.audioSrc;
  }
}
