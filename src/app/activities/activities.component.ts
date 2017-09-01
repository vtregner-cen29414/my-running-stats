import {Component, Input, OnInit} from '@angular/core';
import {MonthActivities} from '../model/monthactivities';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  @Input()
  public activities: MonthActivities;

  @Input()
  currentActivityType = 0;

  convertSeconds(seconds: number): string {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  computePace(time: number, distance: number): string {
    const seconds = (time) / (distance / 1000);
    return '' + Math.floor(seconds / 60) + ':' + this.zeroFill(Math.round(seconds % 60), 2);
  }

  zeroFill( number, width ): string {
    width -= number.toString().length;
    if ( width > 0 ) {
      return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + ''; // always return a string
  }

  constructor() { }

  ngOnInit() {
  }

}
