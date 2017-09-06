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
export class AppComponent  {

}
