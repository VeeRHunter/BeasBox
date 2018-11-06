import { Component }     from '@angular/core';

import { HelperService } from '../../../shared/services/helper.service';


@Component({
  selector: 'search-toolbar',
  templateUrl: 'search-toolbar.html'
})
export class SearchToolbarComponent {

  selectedView: string;
  curSize: number;
  
  constructor(private helperService: HelperService) {
    this.helperService.gridSize$.subscribe((size) => this.curSize = size);

    this.helperService.selectedView$.subscribe((view) => this.selectedView = view);
    this.helperService.setView("grid");
  }

  onIncreaseGrid() {
    this.helperService.changeGrid('up');
  }

  onDecreaseGrid() {
    this.helperService.changeGrid('down');
  }

  onViewChange() {
    let newView: string = this.selectedView === 'list' ? 'grid' : 'list';
    this.helperService.setView(newView);
  }
}
