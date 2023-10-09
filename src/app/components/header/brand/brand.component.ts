import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html'
})
export class BrandComponent {
  @Input() shapeSrc : string = '';
  @Input() shapeId : string = '';
}
