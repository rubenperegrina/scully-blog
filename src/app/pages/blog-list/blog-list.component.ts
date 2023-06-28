import { Component, inject } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html'
})
export class BlogListComponent {
  scullyRouteService = inject(ScullyRoutesService);
  posts$: Observable<ScullyRoute[]> = this.scullyRouteService.available$.pipe(
    map((routes) => {
      return routes
        .filter(({ published, route }) => published && route.includes('/blog/'))
        .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
    })
  );
}