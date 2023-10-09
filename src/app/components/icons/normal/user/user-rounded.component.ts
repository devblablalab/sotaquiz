import { Component,Input } from '@angular/core';

@Component({
  selector: 'i-user-rounded',
  templateUrl: './templates/user-rounded.component.html',
})
export class UserRoundedIcon {
    @Input() iconFillColor : string = '';
}
