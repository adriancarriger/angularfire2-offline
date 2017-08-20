import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(value: any, searchInput: string, searchKeys: string[]): any[] {
    if (!value) { return [] }
    const searchTerm = searchInput.toLowerCase();

    return value.filter(item => {
      return searchKeys
        .map(key => item[key].toLowerCase())
        .join(' ')
        .indexOf(searchTerm) !== -1;
    })
  }
}
