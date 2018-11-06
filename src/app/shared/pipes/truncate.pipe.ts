import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'truncate'
})

export class TruncatePipe implements PipeTransform {

    transform(value: string, limit = 20, completeWords = false, ellipsis = '...') {
        if (completeWords) {
          limit = value.substr(0, 13).lastIndexOf(' ');
        }
        if (value.length <= limit) { ellipsis = '';} 

        return `${value.substr(0, limit)}${ellipsis}`;
    }
}
    