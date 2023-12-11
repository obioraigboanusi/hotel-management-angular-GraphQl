import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

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

const CREATE_Listing = gql`
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
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  
  constructor(private apollo: Apollo) {}

  getListings(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_Linstings,
    }).valueChanges;
  }
}
