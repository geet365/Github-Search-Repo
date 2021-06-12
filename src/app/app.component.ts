import { Component } from '@angular/core';
import { GithubRepoSearchService } from './services/githubRepoSearch/github-repo-search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private githubRepoSearch: GithubRepoSearchService) {}

  onSearch(event: InputEvent) {
    const query = (event.target as HTMLInputElement).value;
    this.githubRepoSearch.search(query);
  }
}
