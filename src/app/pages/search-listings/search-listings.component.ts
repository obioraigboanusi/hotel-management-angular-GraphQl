import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Listing } from './../../interfaces';
import { Component, OnInit } from '@angular/core';
const SEARCH_LISTINGS = gql`
  query ($listing_title: String, $city: String, $postal_code: String) {
    searchListings(
      listing_title: $listing_title
      city: $city
      postal_code: $postal_code
    ) {
      _id
      listing_title
      description
      postal_code
      city
      street
      price
      email
      username
    }
  }
`;
const GET_Linstings = gql`
  query {
    listings {
      _id
      listing_title
      description
      postal_code
      city
      street
      price
      email
      username
    }
  }
`;
@Component({
  selector: 'app-search-listings',
  templateUrl: './search-listings.component.html',
  styleUrls: ['./search-listings.component.css'],
})
export class SearchListingsComponent implements OnInit {
  searchForm: FormGroup;
  listings: Listing[];

  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private router: Router,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      listing_title: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
    });
    this.apollo
      .watchQuery<any>({
        query: GET_Linstings,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.listings = data.listings;
      });
  }
  searchListing() {
    this.apollo
      .watchQuery({
        query: SEARCH_LISTINGS,
        variables: this.formatPayload(this.searchForm.value),
      })
      .valueChanges.subscribe(({ data, loading }) => {
        let res = data as any;
        this.listings = res.searchListings;
      });
  }
  formatPayload(data: any) {
    let obj = data;
    const keys = Object.keys(data);
    keys.map((item: string) => {
      if (!data[item]) {
        delete obj[item];
      }
    });
    return obj;
  }
}
