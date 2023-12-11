import { AuthService } from './../../services/auth.service';
import { Listing } from './../../interfaces';
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_Admin_Linstings = gql`
  query ($username: String) {
    listingsAddedByAdmin(username: $username) {
      _id
      listing_title
      description
      city
      postal_code
      price
      email
      street
      username
    }
  }
`;

@Component({
  selector: 'app-admin-listings',
  templateUrl: './admin-listings.component.html',
  styleUrls: ['./admin-listings.component.css'],
})
export class AdminListingsComponent implements OnInit {
  listings: Listing[] = [];
  firstname: any;
  constructor(private apollo: Apollo, private _auth: AuthService) {}

  ngOnInit(): void {
    const user = this._auth.getUser();
    this.firstname= user?.firstname
    if (!!user) {
      this.apollo
        .watchQuery<any>({
          query: GET_Admin_Linstings,
          variables: {
            username: user.username,
          },
        })
        .valueChanges.subscribe(({ data, loading }) => {
          // console.log(loading);
          this.listings = data.listingsAddedByAdmin;
        });
    }
  }
}
