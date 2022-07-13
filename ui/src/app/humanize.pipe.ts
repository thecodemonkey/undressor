import { Pipe, PipeTransform } from '@angular/core';
import * as humanize from 'humanize-plus';

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
