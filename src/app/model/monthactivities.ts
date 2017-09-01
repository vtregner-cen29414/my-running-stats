import {Activity} from './strava.model';
import {Observable} from 'rxjs/Observable';
import {ActivitySummary} from './activitysummary.model';
import {Subject} from 'rxjs/Subject';

export  class MonthActivities {

  public currentMonth: Date;

  public activityTypes: ActivitySummary[] = [null, null, null];

  constructor(currentMonth: Date, activities: Observable<Activity[]>, loadingFinishedSubject: Subject<MonthActivities>) {
    activities.subscribe(data => {
      this.currentMonth = currentMonth;

      const runActivities = data.filter(activity => activity.type === 'Run');
      const runTotalDistance = runActivities.reduce((sum, act) => sum + act.distance, 0)  ;
      const runNums = runActivities.length  ;

      this.activityTypes[0] = new ActivitySummary(runActivities, runTotalDistance, runNums);

      const rideActivities = data.filter(activity => activity.type === 'Ride');
      const rideTotalDistance = rideActivities.reduce((sum, act) => sum + act.distance, 0)  ;
      const rideNums = rideActivities.length  ;

      this.activityTypes[1] = new ActivitySummary(rideActivities, rideTotalDistance, rideNums);

      const hikeActivities = data.filter(activity => activity.type === 'Hike' || activity.type === 'Walk');
      const hikeotalDistance = hikeActivities.reduce((sum, act) => sum + act.distance, 0)  ;
      const hikeNums = hikeActivities.length  ;

      this.activityTypes[2] = new ActivitySummary(hikeActivities, hikeotalDistance, hikeNums);

      loadingFinishedSubject.next(this);
    });
  }

}
