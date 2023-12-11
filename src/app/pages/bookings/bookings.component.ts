import { AuthService } from './../../services/auth.service';
import { Booking } from './../../interfaces';
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_User_Bookings = gql`
  query ($username: String) {
    bookingsByUser(username: $username) {
      _id
      listing_id
      booking_date
      booking_start
      booking_end
      username
    }
  }
`;

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  constructor(private apollo: Apollo, private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    this.apollo
      .watchQuery<any>({
        query: GET_User_Bookings,
        variables: {
          username: user.username,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        console.log(loading);
        this.bookings = data.bookingsByUser;
      });
  }
}
