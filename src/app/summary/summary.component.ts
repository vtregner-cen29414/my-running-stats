import { Component, OnInit } from '@angular/core';
import {StravaService} from '../strava.service';
import {MonthActivities} from '../model/monthactivities';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  currentActivity = 0;
  activities: MonthActivities[];
  maxDistances: number[] = [0, 0];
  minDates: Date[] = [new Date(), new Date()];

  constructor(private stravaService: StravaService) { }

  ngOnInit() {
    this.stravaService.activityTypeObserver.subscribe((type: number) => {
      this.currentActivity = type;
    });


    this.activities = this.stravaService.activities.slice().reverse();

    this.stravaService.activityLoadedSubject.subscribe((data: MonthActivities) => {
      for (let i = 0; i < this.maxDistances.length; i++ ) {
        if (data.activityTypes[i].totalDistance > this.maxDistances[i]) {
          this.maxDistances[i] = data.activityTypes[i].totalDistance;
        }
        if (data.activityTypes[i].totalDistance !== 0 && data.currentMonth < this.minDates[i]) {
          this.minDates[i] = data.currentMonth;
        }
      }
    });
  }

  computeHeight(month: MonthActivities): string {
    return Math.ceil(month.activityTypes[this.currentActivity].totalDistance / this.maxDistances[this.currentActivity] * 300) + 'px';
  }

  roundDistance(distance: number): number {
    return Math.round(distance / 1000);
  }

  shouldDisplayMonth(month: MonthActivities): boolean {
    return month.currentMonth != null && month.currentMonth >= this.minDates[this.currentActivity];
  }

  onMonthSelect(month: number) {
    console.log('Month ' + month + ' selected' );
    this.stravaService.monthSelected.next(month);
  }

}
