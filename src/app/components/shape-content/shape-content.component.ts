import { Component, Input } from '@angular/core';

@Component({
  selector: 'shape-content',
  templateUrl: './shape-content.component.html'
})
export class ShapeContentComponent {
  @Input() shapeSrc : string = '';
  @Input() shapeId : string = '';
  @Input() content : string = '';
}
