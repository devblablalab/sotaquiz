import { Component,Input } from '@angular/core';

@Component({
  selector: 'i-user-rounded-bold',
  templateUrl: './templates/user-rounded.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserRoundedBoldIcon {
    @Input() iconFillColor : string = '';
}
