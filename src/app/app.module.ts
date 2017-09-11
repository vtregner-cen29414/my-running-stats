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
import { RouterModule, Routes} from '@angular/router';
import { ContentComponent } from './content/content.component';
import { TokenExchangeComponent } from './token-exchange/token-exchange.component';
import {AuthGuard} from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/stats', pathMatch: 'full' },
  { path: 'login', component:  LoginComponent},
  { path: 'token_exchange', component:  TokenExchangeComponent},
  { path: 'stats', component:  ContentComponent, canActivate: [AuthGuard]},
  { path: 'error', component:  ErrorComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SummaryComponent,
    ActivitiesComponent,
    RunComponent,
    RideComponent,
    HikeComponent,
    ContentComponent,
    TokenExchangeComponent,
    LoginComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    TooltipModule.forRoot(),
    TabsModule.forRoot()
  ],
  providers: [StravaService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
