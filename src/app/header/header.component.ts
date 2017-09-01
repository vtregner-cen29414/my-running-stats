import { Component, OnInit } from '@angular/core';
import {StravaService} from '../strava.service';
import {Athlete} from '../model/strava.model';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  athlete: Observable<Athlete>;
  currentActivityType = 0;

  constructor(private stravaService: StravaService) { }

  ngOnInit() {
    this.athlete = this.stravaService.athlete$;
  }

  getDisplayName(athlete: Athlete): string {
    return athlete != null ? athlete.firstname + ' ' + athlete.lastname : '';
  }

  onSelectActivity(type: number) {
    console.log(type);
    this.currentActivityType = type;
    this.stravaService.activityTypeObserver.next(type);
  }

}
