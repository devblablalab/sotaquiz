import { Component,Input } from '@angular/core';

@Component({
  selector: 'i-user-square-bold',
  templateUrl: './templates/user-square.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserSquareBoldIcon {
  @Input() iconFillColor : string = '';
}
