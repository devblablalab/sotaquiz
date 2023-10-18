import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
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

  constructor(public service: AudioService, private elementRef : ElementRef) { 
    this.service.audioPlayer.addEventListener('ended', () => {
      this.service.audioPlayer.currentTime = 0;
      this.service.isPlaying = false;
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
    this.service.isPlaying = !this.service.isPlaying;
  }

  public toggleStateVolume(e : Event) {
    const volumeIcon = this.elementRef.nativeElement.querySelector('.volume-icon');
    const { target } = e;
    if(target === volumeIcon || volumeIcon?.contains(target as Node)) {
      this.volumeIsOpen = !this.volumeIsOpen;
    }
  }

  public playAudio() {
    this.service.playAudio();
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
    const volumeIcon = this.elementRef.nativeElement.querySelector('.volume-icon');
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
    const durationSlider = this.elementRef.nativeElement.querySelector('.duration-slider') as HTMLInputElement;
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
