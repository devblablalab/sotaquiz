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

  constructor(private service: AudioService) { 
    this.service.audioPlayer.addEventListener('ended', () => {
      this.service.audioPlayer.currentTime = 0;
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
    this.service.audioPlayer.src = this.service.getAudioSrc();
    this.service.audioPlayer.load();
    if (this.service.audioPlayer.paused) {
      this.service.audioPlayer.currentTime = this.service.currentTime;
    } else {
      this.service.currentTime = 0;
    }
    this.service.audioPlayer.play();
  }

  public pauseAudio() {
    this.service.currentTime = this.service.audioPlayer.currentTime;
    this.service.audioPlayer.pause();
  }

  public seekTo(e: Event) {
    const { currentTarget } = e;
    if (this.service.audioPlayer.src && currentTarget instanceof HTMLInputElement) {
      const seekTime = (Number(currentTarget.value) / 100) * this.service.audioPlayer.duration;
      this.service.audioPlayer.currentTime = seekTime;
    }
  }

  public setVolume(e: Event) {
    const { currentTarget } = e;
    if (this.service.audioPlayer && currentTarget instanceof HTMLInputElement) {
      this.service.audioPlayer.volume = Number(currentTarget.value) / 100;
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
    this.service.timeUpdateSubscription = interval(1100).subscribe(() => {
      this.updateRangeslider();
    });
  }
  
  private stopUpdatingRangeslider() {
    if (this.service.timeUpdateSubscription) {
      this.service.timeUpdateSubscription.unsubscribe();
    }
  }

  private updateRangeslider() {
    const durationSlider = document.querySelector('.duration-slider') as HTMLInputElement;
    if (this.service.audioPlayer) {
      const currentTime = this.service.audioPlayer.currentTime;
      const duration = this.service.audioPlayer.duration;
  
      if (!isNaN(duration)) {
        const progress = (currentTime / duration) * 100;
        this.service.currentTime = currentTime;
        durationSlider.value = progress.toString();
      }
    }
  }
}
