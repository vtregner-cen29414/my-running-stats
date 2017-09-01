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

  currentActivityType = 0;

  selectedMonthIndex = 0;


  constructor(private stravaService: StravaService) {}

  ngOnInit(): void {
    this.activities = this.stravaService.activities;
    this.stravaService.activityTypeObserver.subscribe((type: number) => {
      this.currentActivityType = type;
    });

    this.stravaService.monthSelected.subscribe((month: number) => {
      this.selectedMonthIndex = this.activities.length - month - 1;
    });
  }



}
