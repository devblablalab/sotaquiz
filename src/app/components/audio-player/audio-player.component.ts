import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() audioLetter : string = '';
  public isPlaying : boolean = false;
  public volumeIsOpen : boolean = false;
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
    document.addEventListener("click", (e) => this.handleDocumentVolumeClick(e));
  }

  ngOnDestroy() {
    this.stopUpdatingRangeslider();
    document.removeEventListener("click", (e) => this.handleDocumentVolumeClick(e));
  }

  public toggleStateAudio() {
    this.isPlaying = !this.isPlaying;
  }

  public toggleStateVolume(e : Event) {
    const volumeIcon = document.querySelector('.volume-icon');
    const { target } = e;
    if(target === volumeIcon || volumeIcon?.contains(target as Node)) {
      this.volumeIsOpen = !this.volumeIsOpen;
    }
  }

  public playAudio() {
    this.audioPlayer.src = this.service.getAudioSrc();
    this.audioPlayer.load();
    if (this.audioPlayer.paused) {
      this.audioPlayer.currentTime = this.currentTime;
    } else {
      this.currentTime = 0;
    }
    this.audioPlayer.play();
  }

  public pauseAudio() {
    this.currentTime = this.audioPlayer.currentTime;
    this.audioPlayer.pause();
  }

  public seekTo(e: Event) {
    const { currentTarget } = e;
    if (this.audioPlayer.src && currentTarget instanceof HTMLInputElement) {
      const seekTime = (Number(currentTarget.value) / 100) * this.audioPlayer.duration;
      this.audioPlayer.currentTime = seekTime;
    }
  }

  public setVolume(e: Event) {
    const { currentTarget } = e;
    if (this.audioPlayer && currentTarget instanceof HTMLInputElement) {
      this.audioPlayer.volume = Number(currentTarget.value) / 100;
    }
  }

  private handleDocumentVolumeClick(e: Event) {
    const volumeIcon = document.querySelector('.volume-icon');
    const { target } = e;
    const targetElement = target as HTMLElement;

    if (volumeIcon && !volumeIcon.contains(target as Node) && !targetElement?.classList.contains('volume-slider')) {
      this.volumeIsOpen = false;
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
