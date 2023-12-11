import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookingService } from './../../services/booking.service';
// import { Router } from '@angular/router';
// import { ListingService } from './../../services/listing.service';
import { Listing } from './../../interfaces';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listing-item',
  templateUrl: './listing-item.component.html',
  styleUrls: ['./listing-item.component.css'],
})
export class ListingItemComponent implements OnInit {
  @Input() listing: Listing;
  bookingForm: FormGroup;
  isUserType: boolean = false;
  submitted: boolean = false;

  constructor(
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
    const authUser = this.auth.getUser();
    const isLoggedIn = this.auth.isLoggedIn();
    if (isLoggedIn && authUser) {
      this.isUserType = authUser.type === 'user';
    } else {
      this.isUserType = true;
    }
  }

  open(content: any) {
    if (this.auth.isLoggedIn()) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    } else {
      alert('You are not logged in. Please login to continue!');
    }
  }
  bookingHandler(listing_id: string, modal: any) {
    this.submitted = true;
    const user = this.auth.getUser();
    if (this.bookingForm.valid && user) {
      this.bookingService
        .book({ ...this.bookingForm.value, listing_id })
        .subscribe(({ data }) => {
          this.bookingForm.reset();
          modal.close();
        });
    }
  }
}
