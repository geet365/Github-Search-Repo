import { Component, Input } from '@angular/core';
import { get } from 'lodash-es';
import { GithubRepo } from 'src/app/global.types';


@Component({
  selector: 'app-repo-card',
  templateUrl: './repo-card.component.html',
  styleUrls: ['./repo-card.component.scss']
})
export class RepoCardComponent {
  @Input()
  repo: GithubRepo;

  props = [
    { label: 'Name', path: 'full_name' },
    { label: 'Forks', path: 'forks_count' },
    { label: 'Language', path: 'language' },
    { label: 'License', path: 'license.name' },
    { label: 'Watchers', path: 'watchers_count' },
    { label: 'Size', path: 'size' },
    { label: 'Created at', path: 'created_at' },
    { label: 'Updated at', path: 'updated_at' },
  ];

  get = get;

  constructor() { }
}
