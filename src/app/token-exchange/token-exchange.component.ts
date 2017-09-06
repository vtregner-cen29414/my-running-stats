import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {StravaService} from '../strava.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-token-exchange',
  templateUrl: './token-exchange.component.html',
  styleUrls: ['./token-exchange.component.css']
})
export class TokenExchangeComponent implements OnInit {

  constructor(private authService: StravaService, private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      const code: string = params['code'];
      console.log(params);
      if (code && code != null) {
        this.authService.fetchAccessToken(code);
      } else {
        // TODO
        console.log('Error while autheticating on strava');
      }
    } )
  }

}
