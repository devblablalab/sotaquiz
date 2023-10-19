import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-quiz',
  templateUrl: './header-quiz.component.html',
  styleUrls: ['./header-quiz.component.scss'] 
})

export class HeaderQuizComponent {
  @Input() headerBackgroundColor : string = '';
}
