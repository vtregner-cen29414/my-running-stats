import {Input} from '@angular/core';
import {ActivitySummary} from '../model/activitysummary.model';

export class ActivityCommon {

  @Input()
  activitySummary: ActivitySummary;

  @Input()
  month: Date;


  convertSeconds(seconds: number): string {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  computePace(time: number, distance: number): string {
    const seconds = (time) / (distance / 1000);
    return '' + Math.floor(seconds / 60) + ':' + this.zeroFill(Math.round(seconds % 60), 2);
  }

  computeSpped(time: number, distance: number): number {
    return distance / 1000 / (time / 60 / 60);
  }

  zeroFill( number, width ): string {
    width -= number.toString().length;
    if ( width > 0 ) {
      return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + ''; // always return a string
  }

}
