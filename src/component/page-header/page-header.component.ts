import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.less'
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() description: string = ''
}
