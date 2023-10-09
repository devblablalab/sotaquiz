import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-audio-volume',
  templateUrl: './templates/volume.component.html',
})
export class AudioVolumeIcon {
  @Input() iconFillColor : string = '';
}
