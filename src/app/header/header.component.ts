import {Component, Inject, OnInit} from '@angular/core';
import {StravaService} from '../strava.service';
import {Athlete} from '../model/strava.model';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  athlete: Athlete;
  currentActivityType = 0;

  constructor(private stravaService: StravaService, @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.stravaService.athleteLoadedObserver.subscribe((data: Athlete) => {
      console.log('HeaderComponent: athleteLoadedObserver');
      this.athlete = data;
    });
  }

  getDisplayName(athlete: Athlete): string {
    return athlete != null ? athlete.firstname + ' ' + athlete.lastname : '';
  }

  onSelectActivity(type: number) {
    this.currentActivityType = type;
    this.stravaService.activityTypeObserver.next(type);
  }

}
