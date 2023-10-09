import { Component,Input } from '@angular/core';

@Component({
  selector: 'i-user-bordered-bold',
  templateUrl: './templates/user-bordered.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserBorderedBoldIcon {
    @Input() iconFillColor : string = '';
}
