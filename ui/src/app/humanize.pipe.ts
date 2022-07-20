import { Pipe, PipeTransform } from '@angular/core';
import * as humanize from 'humanize-plus';
import * as moment from 'moment';


@Pipe({
  name: 'humanize'
})
export class HumanizePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    if (!Number.isNaN(value)) {
      return humanize.compactInteger(value as number);
    }

    return value;
  }
}

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    if (value) {
      return moment(value as string).fromNow(true);
    }

    return value;
  }
}
