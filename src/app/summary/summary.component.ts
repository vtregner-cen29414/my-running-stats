import { Component, OnInit } from '@angular/core';
import {StravaService} from '../strava.service';
import {MonthActivities} from '../model/monthactivities';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  currentActivityType = 0;
  activities: MonthActivities[];
  maxDistances: number[] = [0, 0, 0];
  minDates: Date[] = [new Date(), new Date(), new Date()];
  selectedMonth = 0;

  constructor(private stravaService: StravaService) { }

  ngOnInit() {
    this.stravaService.activityTypeObserver.subscribe((type: number) => {
      this.currentActivityType = type;
    });

    this.activities = this.stravaService.getActivitiesInSelectedYear().slice().reverse();
    this.selectedMonth = this.activities.length - 1;

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

    this.stravaService.yearObserver.subscribe((year: Date) => {
      this.activities = this.stravaService.getActivitiesInSelectedYear(year).slice().reverse();
      this.onMonthSelect(this.activities.length - 1);
    });
  }

  computeHeight(month: MonthActivities): string {
    return Math.ceil(month.activityTypes[this.currentActivityType].totalDistance / this.maxDistances[this.currentActivityType] * 300) + 'px';
  }

  roundDistance(distance: number): number {
    return Math.round(distance / 1000);
  }

  shouldDisplayMonth(month: MonthActivities): boolean {
    return month.currentMonth != null && month.currentMonth >= this.minDates[this.currentActivityType];
  }

  onMonthSelect(month: number) {
    console.log('Month ' + month + ' selected' );
    this.stravaService.monthSelected.next(month);
    this.selectedMonth = month;
  }

}
