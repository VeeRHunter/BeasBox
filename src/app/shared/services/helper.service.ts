import { Injectable }      from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class HelperService {

    curPage$: BehaviorSubject<string>      = new BehaviorSubject<string>('FeaturedPage');
    selectedView$: BehaviorSubject<string> = new BehaviorSubject<string>('list');
    gridSize$: BehaviorSubject<number>     = new BehaviorSubject<number>(1);

    constructor() {
    }

    changePage(page: string) {
        this.curPage$.next(page);
    }

    changeGrid(method: string) {
        let curVal: number = this.gridSize$.getValue();

        if (method === 'up') {
            if (curVal < 2) this.gridSize$.next(curVal + 1);
        }
        else if (method === 'down') {
            if (curVal > 0) this.gridSize$.next(curVal - 1);
        }
    }

    setView(newView: string) {
        this.selectedView$.next(newView);
    }
}