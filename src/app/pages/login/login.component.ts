import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const AUTH_Login = gql`
  mutation ($username: String, $password: String) {
    login(username: $username, password: $password) {
      token
      user {
        firstname
        lastname
        type
        username
        email
      }
    }
  }
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public error: string;
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private router: Router,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.apollo
        .mutate({
          mutation: AUTH_Login,
          variables: this.loginForm.value,
        })
        .subscribe(({ data, loading }) => {
          let res = data as any;
          if (!loading && !!res.login.token) {
            this._auth.storeToken(res.login.token);
            this._auth.saveUser(res.login.user);
            res.login.user.type === 'user'
              ? this.router.navigate(['/'])
              : res.login.user.type === 'admin'
              ? this.router.navigate(['/admin-listings'])
              : null;
          } else {
            this.error = 'Username or password is incorrect';
          }
        });
    }
  }
}
