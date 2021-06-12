import { Component } from '@angular/core';
import { GithubRepoSearchService, SORT_ORDER } from 'src/app/services/githubRepoSearch/github-repo-search.service';

type SortableProp = { label: string; path: string };

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  sortableProps: SortableProp[] = [
    { label: 'Stars', path: 'stars' },
    { label: 'Updated at', path: 'updated' }
  ];

  isLoading = false;

  get sortedBy() {
    return this.githubRepoSearch.sortBy;
  }

  get sortOrder() {
    return this.githubRepoSearch.sortOrder;
  }

  get hasQueryApplied() {
    return this.githubRepoSearch.currentQuery;
  }

  constructor(private githubRepoSearch: GithubRepoSearchService) {
    this.githubRepoSearch.isLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  onSearch(event: InputEvent) {
    const query = (event.target as HTMLInputElement).value;
    this.githubRepoSearch.search(query);
  }

  getSortIcon(sortableProp: SortableProp) {
    if (this.sortedBy === sortableProp.path) {
      return this.sortOrder === 'asc' ? '↑' : '↓';
    }

    return ' ';
  }

  sortBy(sortableProp: SortableProp) {
    /** Sorting doesn't make sense if search query is not set  */
    if (this.githubRepoSearch.currentQuery) {
      let order: SORT_ORDER = 'asc';

      /** Toggle order if user clicked on sorted by button */
      if (this.sortedBy === sortableProp.path) {
        /** Remove sorting if order is desc */
        if (this.sortOrder === 'desc') {
          this.githubRepoSearch.setSortAttributes(null, null);
          return;
        }
        order = 'desc';
      }

      this.githubRepoSearch.setSortAttributes(sortableProp.path, order);
    }
  }
}
