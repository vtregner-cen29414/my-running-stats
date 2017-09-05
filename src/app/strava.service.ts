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

  public activityMap: Map<number, MonthActivities[]> = new Map();

  public athlete$: Observable<Athlete>;

  public activityTypeObserver: Subject<number> = new Subject();

  public activityLoadedSubject: Subject<MonthActivities> = new Subject();

  public monthSelected: Subject<number> = new Subject();

  public yearObserver: Subject<Date> = new Subject();

  constructor(private http: HttpClient) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.fetchAthlete()    ;
    this.fetchActivities(new Date());
  }

  public getActivitiesInSelectedYear(year?: Date): MonthActivities[] {
    if (!year) {
      year = this.getStartOfYear(new Date());
    }
    if (this.activityMap.has(year.getTime())) {
      return this.activityMap.get(year.getTime());
    } else {
      this.fetchActivities(year);
      return this.activityMap.get(year.getTime());
    }
  }

  public getStartOfYear(year: Date): Date {
    const d = new Date(year);
    d.setDate(1);
    d.setMonth(0);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  public getEndOfYear(year: Date): Date {
    let d = new Date(year);
    d.setDate(31);
    d.setMonth(11);
    d.setHours(23, 59, 59, 999);
    if (d > new Date()) {
      d = new Date();
    }
    return d;
  }

  fetchActivities(yearFrom: Date) {
    const startOfMonth = this.getEndOfYear(yearFrom);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    startOfMonth.setMonth(startOfMonth.getMonth() + 1);

    const activities: MonthActivities[] = [];
    this.activityMap.set(this.getStartOfYear(yearFrom).getTime(), activities);

    do {
      startOfMonth.setMonth(startOfMonth.getMonth() - 1);
      let endOfMonth = new Date(startOfMonth.getTime());
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      if (endOfMonth > new Date()) {
        endOfMonth = new Date();
      }

      console.log(`Fetching ${startOfMonth.toLocaleDateString()} - ${endOfMonth.toLocaleDateString()}`);
      const activitiesObservable = this.http
        .get<Activity[]>(StravaService.STRAVA_BASE_URL + '/athlete/activities', {
          params: new HttpParams()
            .set('per_page', '200')
            .set('before', (endOfMonth.getTime() / 1000).toString())
            .set('after', (startOfMonth.getTime() / 1000).toString()),
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.config.accessToken}`)});

      // this.activities.push(new MonthActivities(new Date(startOfMonth.getTime()), activitiesObservable, this.activityLoadedSubject));
      activities.push(new MonthActivities(new Date(startOfMonth.getTime()), activitiesObservable, this.activityLoadedSubject));
    }
    while (startOfMonth > this.getStartOfYear(yearFrom));

 }


  fetchAthlete() {
    console.log('Fetching athlete');
    this.athlete$ = this.http
      .get<Athlete>(StravaService.STRAVA_BASE_URL + '/athlete', {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.config.accessToken}`)});
  }
}
