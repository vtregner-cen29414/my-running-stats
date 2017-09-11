import {HttpErrorResponse} from '@angular/common/http';

export interface Activity {
  id: number,
  athlete: {
    id: number,
    resource_state: number
  },
  name: string,
  distance: number,
  moving_time: number,
  elapsed_time: number,
  total_elevation_gain: number,
  type: string,
  start_date: Date,
  start_date_local: Date,
  average_speed: number,
  max_speed: number,
  average_watts: number,
  max_watts: number,
  weighted_average_watts: number,
  kilojoules: number,
  device_watts: boolean,
  has_heartrate: boolean,
  average_heartrate: number,
  max_heartrate: number
}

export interface Athlete {
  id: 227615,
  firstname: string,
  lastname: string,
  profile_medium: URL,
  profile: URL,
  city: string,
  state: string,
  country: string,
  sex: string,
  premium: boolean,
  created_at: Date
}

export interface Token {
  access_token: string,
  athlete: Athlete
}

export interface ErrorCallback {
  handleError(err: HttpErrorResponse);
}
