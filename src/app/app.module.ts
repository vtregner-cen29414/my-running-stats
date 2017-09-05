import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {StravaService} from './strava.service';
import {HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { SummaryComponent } from './summary/summary.component';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { ActivitiesComponent } from './activities/activities.component';
import { RunComponent } from './activities/run/run.component';
import { RideComponent } from './activities/ride/ride.component';
import { HikeComponent } from './activities/hike/hike.component';
import {TabsModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SummaryComponent,
    ActivitiesComponent,
    RunComponent,
    RideComponent,
    HikeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot()
  ],
  providers: [StravaService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
