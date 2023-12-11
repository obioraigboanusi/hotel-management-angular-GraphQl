import { AuthService } from './../../services/auth.service';
import { gql, Apollo } from 'apollo-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

const ADD_LISTING = gql`
  mutation (
    $listing_title: String!
    $description: String!
    $street: String!
    $city: String!
    $postal_code: String!
    $price: Float!
    $email: String!
    $username: String!
  ) {
    addListing(
      listing_title: $listing_title
      description: $description
      street: $street
      city: $city
      postal_code: $postal_code
      price: $price
      email: $email
      username: $username
    ) {
      _id
      listing_title
      description
      street
      city
      postal_code
      price
      email
      username
    }
  }
`;

@Component({
  selector: 'app-new-listing',
  templateUrl: './new-listing.component.html',
  styleUrls: ['./new-listing.component.css'],
})
export class NewListingComponent implements OnInit {
  addListingForm: FormGroup;
  submited: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.addListingForm = this.formBuilder.group({
      listing_title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.minLength(4)]],
      street: ['', [Validators.required, Validators.minLength(4)]],
      city: ['', [Validators.required, Validators.minLength(4)]],
      postal_code: ['', [Validators.required]],
      price: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addListing() {
    this.submited = true;
    const user = this._auth.getUser();
    if (this.addListingForm.valid && !!user) {
      this.apollo
        .mutate({
          mutation: ADD_LISTING,
          variables: { ...this.addListingForm.value, username: user.username },
        })
        .subscribe({
          next: () => {
            this.addListingForm.reset();
          },
          // error: (error: any) => console.log(error),
        });
    }
  }
}
