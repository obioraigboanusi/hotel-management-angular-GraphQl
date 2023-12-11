import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const AUTH_Register = gql`
  mutation (
    $username: String
    $password: String
    $firstname: String
    $lastname: String
    $email: String
    $type: String
  ) {
    addUser(
      username: $username
      password: $password
      firstname: $firstname
      lastname: $lastname
      email: $email
      type: $type
    ) {
      status
      message
    }
  }
`;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted: boolean = false;
  error: string;
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/),
        ],
      ],
      verifyPassword: ['', Validators.required],
      isAdmin: [false, Validators.required],
    });
  }

  signup() {
    this.submitted = true;
    if (this.signupForm.valid) {
      const {
        password,
        verifyPassword,
        username,
        firstname,
        lastname,
        email,
        isAdmin,
      } = this.signupForm.value;
      if (password === verifyPassword) {
        const payload = {
          password,
          username,
          firstname,
          lastname,
          email,
          type: isAdmin ? 'admin' : 'user',
        };
        this.apollo
          .mutate({
            mutation: AUTH_Register,
            variables: payload,
          })
          .subscribe({
            next: ({ data, loading }) => {
              let res = data as any;
              if (res.addUser.status === 'success') {
                this.signupForm.reset();
                this.router.navigate(['']);
              } else {
                alert('Something went wrong!');
              }
            },
            error: (error: any) => console.log(error),
          });
      } else {
        alert('Password does not match!');
      }
    }
  }
}
