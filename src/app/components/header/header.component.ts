import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  authedUser: any;
  // @Input() isAuth:boolean

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this._auth.isLoggedIn();
    this.authedUser = this._auth.getUser();
  }
  logout() {
    this._auth.logOutUser();
    this.isLoggedIn = false;
  }
}
