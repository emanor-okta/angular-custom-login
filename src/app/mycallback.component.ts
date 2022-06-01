import { Component, OnInit, Optional, Injector, Inject } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_CONFIG, OktaConfig, OKTA_AUTH } from '@okta/okta-angular';///src/okta/models/okta.config'; //'../models/okta.config';
//import { Routes, RouterModule, Router } from '@angular/router';

@Component({
  template: `<div>{{error}}</div>`
})
export class MyOktaCallbackComponent implements OnInit {
  //error: string;
  error = null

  constructor(
    @Inject(OKTA_CONFIG) private config: OktaConfig,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    @Optional() private injector?: Injector
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Parse code or tokens from the URL, store tokens in the TokenManager, and redirect back to the originalUri
      await this.oktaAuth.handleLoginRedirect();
    } catch (e: any) {
      // Callback from social IDP. Show custom login page to continue.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Supports auth-js v5 & v6
      const isInteractionRequiredError = this.oktaAuth.isInteractionRequiredError || this.oktaAuth.idx.isInteractionRequiredError;
      if (isInteractionRequiredError(e) && this.injector) {
        const { onAuthResume, onAuthRequired } = this.config;
        const callbackFn = onAuthResume || onAuthRequired;
        if (callbackFn) {
          callbackFn(this.oktaAuth, this.injector);
          return;
        }
      }
  
      console.log('myComponent');
      if (e.toString() != null && e.toString().includes('The client specified not to prompt, but the user is not logged in')) {
        window.location.href = '/login';
      } else {
        this.error = e.toString();
      }
    }
  }
}