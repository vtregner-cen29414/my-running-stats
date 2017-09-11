import {Component, Inject, OnInit} from '@angular/core';
import {StravaService} from '../strava.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public stravaService: StravaService, @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
  }

  login() {
    this.document.location.href = this.stravaService.getAuthorizeUrl();
  }

}
