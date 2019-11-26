import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Activity, Athlete, ErrorCallback, Token} from './model/strava.model';
import {MonthActivities} from './model/monthactivities';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';

@Injectable()
export class StravaService implements OnInit, ErrorCallback {

  private static STRAVA_BASE_URL = 'https://www.strava.com';
  private static STRAVA_BASE_API_URL = StravaService.STRAVA_BASE_URL + '/api/v3';

  private static STORAGE_ACCESS_TOKEN = 'STORAGE_ACCESS_TOKEN';

  public authenticated = false;

  private config =
  {
         'clientID'    : 19867,
         'clientSecret': '9fc4dc916b3f2cc344b1fba9b4d31fc89515209a',
         'accessToken' : null
         // 'testActivityId': id-of-one-of-your-activities
  };

  public activityMap: Map<number, MonthActivities[]> = new Map();

  public activityTypeObserver: Subject<number> = new Subject();

  public activityLoadedSubject: Subject<MonthActivities> = new Subject();

  public monthSelected: Subject<number> = new Subject();

  public yearObserver: Subject<Date> = new Subject();

  public athleteLoadedObserver: Subject<Athlete> = new Subject();

  public athlete: Athlete;

  constructor(private http: HttpClient, private router: Router) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.athleteLoadedObserver.subscribe((data: Athlete) => {
      this.athlete = data;
    });


    const item = localStorage.getItem(StravaService.STORAGE_ACCESS_TOKEN);
    if (item) {
      const token = (JSON.parse(item) as Token);
      const accessToken: string = token.access_token
      if (this.accessTokenIsExpired(token)) {
        this.refreshAccessToken(token).subscribe(refreshedToken => {
          this.loginDone(refreshedToken);
        });
      } else {
        this.loginDone(token);
      }
    }
  }

  private loginDone(token: Token) {
    this.config.accessToken = token.access_token;
    this.fetchAthlete();
    this.fetchActivities(new Date());
    this.authenticated = true;
    this.router.navigate(['/stats']);
  }

  public accessTokenIsExpired(tokenInfo: Token) {
    return tokenInfo.expires_at < (new Date().getTime() / 1000);
  }

  public refreshAccessToken(tokenInfo: Token): Observable<Token> {
    return this.http.post<Token>(StravaService.STRAVA_BASE_API_URL + '/oauth/token',
      {
        client_id: this.config.clientID,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: tokenInfo.refresh_token
      }).pipe(
      tap(response => response.athlete = tokenInfo.athlete),
      tap(response => localStorage.setItem(StravaService.STORAGE_ACCESS_TOKEN, JSON.stringify(response)))
    );
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

  fetchAccessToken(code: string) {
    this.http
      .post<Token>('https://www.strava.com/oauth/token',
        {
          client_id: this.config.clientID,
          client_secret: this.config.clientSecret,
          code: code,
          grant_type: 'authorization_code'
          })
      .subscribe((token: Token) => {
        this.config.accessToken = token.access_token;
        localStorage.setItem(StravaService.STORAGE_ACCESS_TOKEN, JSON.stringify(token));
        this.authenticated = true;
        this.athleteLoadedObserver.next(token.athlete);
        this.fetchActivities(new Date());
        this.router.navigate(['/stats']);
      });
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
        .get<Activity[]>(StravaService.STRAVA_BASE_API_URL + '/athlete/activities', {
          params: new HttpParams()
            .set('per_page', '200')
            .set('before', (endOfMonth.getTime() / 1000).toString())
            .set('after', (startOfMonth.getTime() / 1000).toString()),
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.config.accessToken}`)});

      activities.push(new MonthActivities(new Date(startOfMonth.getTime()), activitiesObservable, this.activityLoadedSubject, this));
    }
    while (startOfMonth > this.getStartOfYear(yearFrom));

 }


  fetchAthlete() {
    console.log('Fetching athlete');
    this.http
      .get<Athlete>(StravaService.STRAVA_BASE_API_URL + '/athlete', {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.config.accessToken}`)})
      .subscribe(
        (data: Athlete) => {
        this.athleteLoadedObserver.next(data);
        },
        (err: HttpErrorResponse) => {
          this.handleError(err);
    });
  }

  public handleError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', err.error.message);
      this.router.navigate(['/error', {message: err.error.message}]);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      if (err.status === 401) {
        this.config.accessToken = null;
        this.authenticated = false;
        localStorage.removeItem(StravaService.STORAGE_ACCESS_TOKEN);
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/error', {status: err.status, message: err.error}]);
      }
    }
  }

  getAuthorizeUrl(): string {
    return StravaService.STRAVA_BASE_URL
        + `/oauth/authorize?client_id=${this.config.clientID}&response_type=code&redirect_uri=${environment.stravaRedirectUri}&approval_prompt=force&scope=read,activity:read_all`;
  }

  isAutheticated(): boolean {
    return this.authenticated;
  }
}
