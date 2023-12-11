import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookingService } from './../../services/booking.service';
import { Router } from '@angular/router';
import { ListingService } from './../../services/listing.service';
import { Listing } from './../../interfaces';
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css'],
})

export class ListingsComponent implements OnInit {
  listings: Listing[] = [];
  bookingForm: FormGroup;
  constructor(
    private apollo: Apollo,
    private listingService: ListingService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private formBulder: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.formBulder.group({
      booking_start: ['', Validators.required],
      booking_end: ['', Validators.required],
    });
    this.apollo
      .watchQuery<any>({
        query: GET_Linstings,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.listings = data.listings;
      });
  }

  // open(content: any) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  // }
  // bookingHandler(listing_id: string, modal: any) {
  //   const user = this.auth.getUser();
  //   this.bookingService
  //     .book({ ...this.bookingForm.value, listing_id })
  //     .subscribe(({ data }) => {
  //       this.bookingForm.reset();
  //       modal.close();
  //     });
  // }
}
