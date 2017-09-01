import {Component, OnInit} from '@angular/core';
import {StravaService} from './strava.service';
import 'rxjs/add/operator/map';
import {MonthActivities} from './model/monthactivities';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  activities: MonthActivities[];

  currentActivity = 0;

  selectedMonthIndex = 0;

  activityDesc = ['runs', 'rides'];

  constructor(private stravaService: StravaService) {}

  ngOnInit(): void {
    this.activities = this.stravaService.activities;
    this.stravaService.activityTypeObserver.subscribe((type: number) => {
      this.currentActivity = type;
    });

    this.stravaService.monthSelected.subscribe((month: number) => {
      this.selectedMonthIndex = this.activities.length - month - 1;
    });
  }

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

}
