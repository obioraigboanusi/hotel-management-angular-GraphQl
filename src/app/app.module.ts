import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { ListingsComponent } from './pages/listings/listings.component';
import { SearchListingsComponent } from './pages/search-listings/search-listings.component';
import { NewListingComponent } from './pages/new-listing/new-listing.component';
import { AdminListingsComponent } from './pages/admin-listings/admin-listings.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';
import { ListingItemComponent } from './components/listing-item/listing-item.component';

const appRoutes: Routes = [
  { path: '', component: ListingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'bookings', canActivate: [UserGuard], component: BookingsComponent },
  {
    path: 'search-listing',
    component: SearchListingsComponent,
  },
  {
    path: 'add-listing',
    canActivate: [AdminGuard],
    component: NewListingComponent,
  },
  {
    path: 'admin-listings',
    canActivate: [AdminGuard],
    component: AdminListingsComponent,
  },
];

const uri = 'http://localhost:9000/graphql';

export function createApollo(httpLink: HttpLink) {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }));

  const auth = setContext((operation, context) => {
    const token = sessionStorage.getItem('token');

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  });

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    BookingsComponent,
    ListingsComponent,
    SearchListingsComponent,
    NewListingComponent,
    AdminListingsComponent,
    HeaderComponent,
    ListingItemComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ApolloModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
