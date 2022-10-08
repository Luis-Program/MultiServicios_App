import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCalendar',
  pure: false
})
export class FilterCalendarPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (object['title'].toLowerCase().replace(/ /g, "").indexOf(arg.toLowerCase().replace(/ /g, "")) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }


}
