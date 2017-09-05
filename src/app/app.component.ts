import {Component, OnInit} from '@angular/core';
import {StravaService} from './strava.service';
import 'rxjs/add/operator/map';
import {MonthActivities} from './model/monthactivities';
import {Athlete} from './model/strava.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  activities: MonthActivities[];

  currentActivityType = 0;

  selectedMonthIndex = 0;

  years: Date[] = [];


  constructor(private stravaService: StravaService) {}

  ngOnInit(): void {
    this.stravaService.athlete$.subscribe((data: Athlete) => {
      const  fake = new Date();
      fake.setFullYear(2016, 0, 1);
      fake.setHours(0, 0, 0, 0);
      this.years.push(fake);

      this.years.push(this.stravaService.getStartOfYear(data.created_at));
      const next = new Date(data.created_at);
      next.setFullYear(next.getFullYear() + 1, 0, 1);
      next.setHours(0, 0, 0, 0);

      while (next.getFullYear() <= (new Date().getFullYear())) {
        this.years.push(next);
        next.setFullYear(next.getFullYear() + 1, 0, 1);
      }

      this.years.reverse();


    });

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

  onYearSelect(yearIndex: number) {
    console.log('Selecting ' + this.years[yearIndex].toLocaleDateString());
    this.stravaService.yearObserver.next(this.years[yearIndex]);
  }

  getYearTotalDistance(): number {
    let total = 0;
    this.activities.forEach(value => {
      total = total + value.activityTypes[this.currentActivityType].totalDistance;
    });
    return Math.round(total / 1000);
  }



}
