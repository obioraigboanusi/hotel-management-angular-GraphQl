import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo, private router: Router) {}

  logOutUser(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['']);
    this.apollo.getClient().resetStore();
  }
  storeToken(token: any): void {
    sessionStorage.setItem('token', token);
  }
  saveUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
  getToken() {
    let token = sessionStorage.getItem('token');
    if (!!token) {
      return token;
    }
    return null;
  }
  getUser() {
    let user = sessionStorage.getItem('user');
    if (!!user) {
      return JSON.parse(user);
    }
    return null;
  }
  isLoggedIn(): boolean {
    let token = this.getToken();
    let user = this.getUser();
    if (!!user && token) {
      return true;
    }
    return false;
  }
}
