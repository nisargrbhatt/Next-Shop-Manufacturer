import { environment, secureAPIURIs } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { Auth0Service } from './auth/auth0.service';
import { Error404Component } from './error404/error404.component';

import { HttpErrorInterceptor } from './http-error.interceptor';

@NgModule({
  declarations: [AppComponent, Error404Component],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    AuthModule.forRoot({
      // The domain and clientId were configured in the previous chapter
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,

      // Request this audience at user authentication time
      audience: environment.auth0Audience,

      // Request this scope at user authentication time
      scope: 'read:current_user',

      // Specify configuration for the interceptor
      httpInterceptor: {
        // allowedList: [
        //   {
        //     // Match any request that starts 'https://dev-qf3-53r4.us.auth0.com/api/v2/' (note the asterisk)
        //     uri: 'http://localhost:7000/*',
        //     tokenOptions: {
        //       // The attached token should target this audience
        //       audience: 'http://localhost:7000',

        //       // The attached token should have these scopes
        //       scope: 'read:current_user',
        //     },
        //   },

        // ],
        allowedList: Object.values(secureAPIURIs).map((uri) => {
          let url = environment.backend_url + uri.url;
          if (uri.hasQuery) {
            url += '/*';
          }
          return url;
        }),
        // allowedList: ['http://localhost:3001/user/oAuthCall'],
      },
    }),
  ],
  providers: [
    Auth0Service,
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
