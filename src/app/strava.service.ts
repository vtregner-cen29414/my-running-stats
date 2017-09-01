import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Activity, Athlete} from './model/strava.model';
import {MonthActivities} from './model/monthactivities';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class StravaService implements OnInit {

  private static STRAVA_BASE_URL = 'https://www.strava.com/api/v3';

  private config =
  {
         'clientID'    : 19867,
         'clientSecret': '9fc4dc916b3f2cc344b1fba9b4d31fc89515209a',
         'accessToken' : '501cdf7311ccee17346b0d2a166b9efc0ea6a6c5'
         // 'testActivityId': id-of-one-of-your-activities
  };

  public activities: MonthActivities[] = [];

  public athlete$: Observable<Athlete>;

  public activityTypeObserver: Subject<number> = new Subject();

  public activityLoadedSubject: Subject<MonthActivities> = new Subject();

  public monthSelected: Subject<number> = new Subject();

  constructor(private http: HttpClient) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.fetchAthlete();
    this.fetchActivities();
  }

  fetchActivities() {
    const startOMonth = new Date();
    startOMonth.setDate(1);
    startOMonth.setHours(0, 0, 0, 0);

    for (let i = 0; i < 12 ; i++) {
      startOMonth.setMonth(startOMonth.getMonth() - 1);
      let endOfMonth = new Date(startOMonth.getTime());
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      if (endOfMonth > new Date()) {
        endOfMonth = new Date();
      }

      console.log(`Fetching ${startOMonth.toLocaleDateString()} - ${endOfMonth.toLocaleDateString()}`);
      const activitiesObservable = this.http
        .get<Activity[]>(StravaService.STRAVA_BASE_URL + '/athlete/activities', {
          params: new HttpParams()
            .set('per_page', '200')
            .set('before', (endOfMonth.getTime() / 1000).toString())
            .set('after', (startOMonth.getTime() / 1000).toString()),
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.config.accessToken}`)});

      this.activities.push(new MonthActivities(new Date(startOMonth.getTime()), activitiesObservable, this.activityLoadedSubject));
    }
  }


  fetchAthlete() {
    console.log('Fetching athlete');
    this.athlete$ = this.http
      .get<Athlete>(StravaService.STRAVA_BASE_URL + '/athlete', {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.config.accessToken}`)});
  }
}
