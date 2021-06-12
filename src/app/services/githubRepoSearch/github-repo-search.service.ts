import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, EMPTY } from 'rxjs';
import { debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { GithubRepo, GithubRepoQueryResponse } from 'src/app/global.types';

export type SORT_ORDER = 'asc' | 'desc';

@Injectable({
  providedIn: 'root',
})
export class GithubRepoSearchService {
  githubRepoUrl = 'https://api.github.com/search/repositories';

  perPage = 30;

  currentQuery = '';

  currentPage = 1;

  currentTotalPage: number = 1;

  sortBy: string | null;

  sortOrder: SORT_ORDER | null;

  /** subject to broadcast list of repo to  */
  emitData = new Subject<GithubRepo[]>();

  /** object to indicate if an api is in progress */
  isLoading = new Subject<boolean>();

  /** keeps list of loaded repo */
  private repoList = [];

  private httpSubject = new Subject<{ q: string; page: string, sort?: string, order?: SORT_ORDER }>();

  private httpResponse: Observable<GithubRepoQueryResponse>;

  constructor(private http: HttpClient) {
    this.httpResponse = this.httpSubject.pipe(
      debounceTime(300),
      switchMap((params) => {
        const query = params.q;

        const finalParams = {
          per_page: `${this.perPage}`,
          ...params,
          q: `${params.q}+in:name`,
        };

        if (this.sortBy) {
          finalParams.sort = this.sortBy;
        }

        if (this.sortOrder) {
          finalParams.order = this.sortOrder;
        }

        this.isLoading.next(true);

        return this.http
          .get<GithubRepoQueryResponse>(this.githubRepoUrl, {
            params: finalParams,
          })
          .pipe(
            catchError((errorResp) => {
              this.isLoading.next(false);
              window.alert(errorResp.error.message);
              return EMPTY;
            }),
            map((resp: GithubRepoQueryResponse | null) => {
              if (resp) {
                resp.query = query;
              }
              this.isLoading.next(false);
              return resp;
            })
          );
      })
    );

    this.httpResponse.subscribe((resp) => {
      if (resp && resp.query === this.currentQuery) {
        this.currentTotalPage = Math.ceil(resp.total_count / this.perPage);
        this.repoList = this.repoList.concat(resp.items);
        this.emitData.next(this.repoList);
      } else {
        console.log('Discarded stale response.');
      }
    });
  }

  private fetch() {
    this.httpSubject.next({
      q: this.currentQuery,
      page: this.currentPage.toString(),
    });
  }

  /** returns observable to listen repoList changes */
  onData() {
    return this.emitData;
  }

  /** Triggers searching */
  search(query: string) {
    this.repoList = [];
    if (query.trim()) {
      this.currentQuery = query;
      this.currentPage = 1;
      this.fetch();
    } else {
      this.emitData.next(this.repoList);
    }
  }

  /** Loads next page and append to repoList */
  nextPage() {
    if (this.currentQuery) {
      this.currentPage += 1;

      if (this.currentPage > this.currentTotalPage) {
        this.currentPage = this.currentTotalPage;
        console.warn('No next page available');
        return;
      }
      this.fetch();
    }
  }

  /** Applies/removes sorting */
  setSortAttributes(attribute: string | null, order: SORT_ORDER | null) {
    this.sortBy = attribute;
    this.sortOrder = order;

    this.repoList = [];
    // reset page to 1
    this.currentPage = 1;

    this.fetch();
  }
}
