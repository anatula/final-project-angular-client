import { Component } from '@angular/core';

@Component({
  template: `
      <h1>404 Not Found</h1>
      <p>You may be lost. Follow the breadcrumbs back <a routerLink="/">home</a>.</p>
  `
})
export class NotFoundComponent { }
