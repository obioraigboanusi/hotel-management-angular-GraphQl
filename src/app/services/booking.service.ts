import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const CREATE_Booking = gql`
  mutation (
    $booking_date: String!
    $booking_start: String!
    $booking_end: String!
    $username: String!
    $listing_id: String
  ) {
    addBooking(
      booking_date: $booking_date
      booking_start: $booking_start
      booking_end: $booking_end
      username: $username
      listing_id: $listing_id
    ) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private apollo: Apollo, private auth: AuthService) {}

  book({
    listing_id,
    booking_start,
    booking_end,
  }: {
    listing_id: string;
    booking_start: string;
    booking_end: string;
  }): Observable<any> {
    const user = this.auth.getUser();
    return this.apollo.mutate({
      mutation: CREATE_Booking,
      variables: {
        booking_date: this.getToday(),
        booking_start: this.formatDate(booking_start),
        booking_end: this.formatDate(booking_end),
        username: user.username,
        listing_id: listing_id,
      },
    });
  }
  formatDate({ day, year, month }: any) {
    return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
  }
  getToday() {
    const today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }
}
