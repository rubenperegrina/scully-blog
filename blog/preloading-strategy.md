---
title: Preloading strategy
description: "How to implement a module preloading strategy"
date: "June 28, 2023"
published: true
tags: ["angular", "modules", "preloading", "router"]
---

If we have our application separated by modules and we apply lazy loading.
Angular by default will load the modules as the user needs them.
There are several ways to control the loading of modules.

### Lazy loading

Modules will be loaded as the user requires them.

```typescript
const routes: Routes = [
  {
    path: "contact",
    loadChildren: () =>
      import("./contact/contact.module").then((m) => m.ContactModule),
  },
  {
    path: "about",
    loadChildren: () =>
      import("./about/about.module").then((m) => m.AboutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

//StandAlone API version

//Lazy loading another routing config
export const routes: Routes = [
  {
    path: "contact",
    loadChildren: () =>
      import("./contact/contact.routes").then((m) => m.CONTACT_ROUTES),
  },
  {
    path: "about",
    loadChildren: () =>
      import("./about/about.routes").then((m) => m.ABOUT_ROUTES),
  },
];

//Directly lazy loading a standalone component
export const routes: Routes = [
  {
    path: "contact",
    loadComponent: () =>
      import("./contact/contact.component").then((m) => m.ContactComponent),
  },
  {
    path: "about",
    loadComponent: () =>
      import("./about/about.component").then((m) => m.AboutComponent),
  },
];

//In your main.ts add:
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
});
```

### Preload all the modules

In this way, all the modules of our application will be loaded at once and ready to use.

```typescript
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

//StandAlone API version
//In your main.ts add:
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withPreloading(PreloadAllModules))],
});
```

### Customised module preloading

We can choose which modules to load first, so the most used modules will already be loaded.

```typescript
@Injectable({
  providedIn:'root'
})
export class PreloadingStrategyService implements PreloadingStrategy {
  private preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable): Observable {
    if (route.data && route.data['preload'] && route.path) {
      this.preloadedModules.push(route.path);
      return load();
    } else {
      return of(null);
    }
  }
}

const routes: Routes = [
  {
    path: "contact",
    loadChildren: () =>
      import("./contact/contact.module").then((m) => m.ContactModule),
  },
  {
    path: "about",
    loadChildren: () =>
      import("./about/about.module").then((m) => m.AboutModule),
    data: { preload: true },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadingStrategyService,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

//StandAlone API version
//In your main.ts add:
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withPreloading(PreloadingStrategyService))],
});
```

### Using ngx-quicklink

ngx-quicklink is a library that loads modules as their link appears on screen.
To install the library: `npm i ngx-quicklink`

```typescript
import { QuicklinkStrategy } from "ngx-quicklink";

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: QuicklinkStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

//StandAlone API version
//In your main.ts add:
import { quicklinkProviders, QuicklinkStrategy } from 'ngx-quicklink';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(QuicklinkStrategy)),
    quicklinkProviders
  ]
})

// Import the QuicklinkDirective in all your standalone components that use preloading:
import { RouterModule } from '@angular/router';
import { QuicklinkDirective } from 'ngx-quicklink';

@Component({
  standalone: true,
  imports: [RouterModule, QuicklinkDirective],
    template: `
    <a routerLink="/form">Form</a>
  `,
})
```