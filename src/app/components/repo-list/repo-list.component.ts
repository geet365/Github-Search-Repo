import { Component } from '@angular/core';
import { GithubRepo } from 'src/app/global.types';
import { GithubRepoSearchService } from 'src/app/services/githubRepoSearch/github-repo-search.service';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.scss']
})
export class RepoListComponent {
  repos: GithubRepo[] = [];

  constructor(private githubRepoSearch: GithubRepoSearchService) {
    this.githubRepoSearch.onData().subscribe(repos => {
      this.repos = repos;
    });
  }

  onScrollDown() {
    this.githubRepoSearch.nextPage();
  }

}
