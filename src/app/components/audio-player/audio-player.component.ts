import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  public isPlaying : boolean = false;
  public currentTime: number = 0;
  public volume = 50;
  public audioPlayer = new Audio();
  private timeUpdateSubscription!: Subscription;

  constructor(private service: AudioService) { 
    this.audioPlayer.addEventListener('ended', () => {
      this.audioPlayer.currentTime = 0;
      this.isPlaying = false;
    });
  }

  ngOnInit() {
    this.startUpdatingRangeslider();
  }

  ngOnDestroy() {
    this.stopUpdatingRangeslider();
  }

  toggleStateAudio() {
    this.isPlaying = !this.isPlaying;
  }

  playAudio() {
    this.audioPlayer.src = this.service.getAudioSrc();
    this.audioPlayer.load();
    if (this.audioPlayer.paused) {
      this.audioPlayer.currentTime = this.currentTime;
    } else {
      this.currentTime = 0;
    }
    this.audioPlayer.play();
  }

  pauseAudio() {
    this.currentTime = this.audioPlayer.currentTime;
    this.audioPlayer.pause();
  }

  seekTo(e: Event) {
    const { currentTarget } = e;
    if (this.audioPlayer && currentTarget instanceof HTMLInputElement) {
      const seekTime = (Number(currentTarget.value) / 100) * this.audioPlayer.duration;
      this.audioPlayer.currentTime = seekTime;
    }
  }

  setVolume(e: Event) {
    const { currentTarget } = e;
    if (this.audioPlayer && currentTarget instanceof HTMLInputElement) {
      this.audioPlayer.volume = Number(currentTarget.value) / 100;
    }
  }

  private startUpdatingRangeslider() {
    this.timeUpdateSubscription = interval(1100).subscribe(() => {
      this.updateRangeslider();
    });
  }
  
  private stopUpdatingRangeslider() {
    if (this.timeUpdateSubscription) {
      this.timeUpdateSubscription.unsubscribe();
    }
  }

  private updateRangeslider() {
    const durationSlider = document.querySelector('.duration-slider') as HTMLInputElement;
    if (this.audioPlayer) {
      const currentTime = this.audioPlayer.currentTime;
      const duration = this.audioPlayer.duration;
  
      if (!isNaN(duration)) {
        const progress = (currentTime / duration) * 100;
        this.currentTime = currentTime;
        durationSlider.value = progress.toString();
      }
    }
  }
}
