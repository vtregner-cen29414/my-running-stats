import { Component, OnInit } from '@angular/core';
import {MonthActivities} from '../model/monthactivities';
import {StravaService} from '../strava.service';
import {Athlete} from '../model/strava.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  activities: MonthActivities[];

  currentActivityType = 0;

  selectedMonthIndex = 0;

  years: Date[] = [];


  constructor(private stravaService: StravaService) {}

  ngOnInit(): void {
    this.stravaService.athleteLoadedObserver.subscribe((data: Athlete) => {
      this.setupYears(data);
    });

    if (this.stravaService.athlete != null) {
      this.setupYears(this.stravaService.athlete);
    }

    this.activities = this.stravaService.getActivitiesInSelectedYear();
    this.stravaService.activityTypeObserver.subscribe((type: number) => {
      this.currentActivityType = type;
    });

    this.stravaService.monthSelected.subscribe((month: number) => {
      this.selectedMonthIndex = this.activities.length - month - 1;
    });

    this.stravaService.yearObserver.subscribe((year: Date) => {
      this.activities = this.stravaService.getActivitiesInSelectedYear(year);
      this.selectedMonthIndex = 0;
    });
  }

  private setupYears(data: Athlete) {
    this.years.push(this.stravaService.getStartOfYear(data.created_at));
    const next = new Date(data.created_at);
    next.setFullYear(next.getFullYear() + 1, 0, 1);
    next.setHours(0, 0, 0, 0);

    while (next.getFullYear() <= (new Date().getFullYear())) {
      this.years.push(next);
      next.setFullYear(next.getFullYear() + 1, 0, 1);
    }

    this.years.reverse();

    console.log(this.years);
  }

  onYearSelect(yearIndex: number) {
    console.log('Selecting ' + this.years[yearIndex].toLocaleDateString());
    this.stravaService.yearObserver.next(this.years[yearIndex]);
  }

  getYearTotalDistance(): number {
    let total = 0;
    this.activities.forEach(value => {
      if (value.activityTypes[this.currentActivityType] != null) {
        total = total + value.activityTypes[this.currentActivityType].totalDistance;
      }
    });
    return Math.round(total / 1000);
  }

}
