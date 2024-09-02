/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../../services/data-service.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { product } from '../types/product.type';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent implements OnInit {
  httpClient = inject(HttpClient);
  private baseUrl = `https://jsonplaceholder.typicode.com`;

  // For SwitchMap
  posts$!: Observable<any[]>;
  comments$!: Observable<any[]>;
  selectedPostId$ = new BehaviorSubject<number | null>(5);
  selectedCommentId$ = new BehaviorSubject<number | null>(22);
  selectedPostId: number | null = null;
  selectedCommentId: number | null = null;

  // For MergeMap
  post: any;
  comments: any[] = [];
  error: any;
  postIds: number[] = [];

  // For Search
  myControl = new FormControl<product | string>('');
  postsa$: Observable<product[]> = this.httpClient.get<product[]>(
    `${this.baseUrl}/posts`
  );
  filteredPosts$!: Observable<product[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.posts$ = this.dataService.getPosts();
    this.comments$ = this.selectedPostId$.pipe(
      switchMap(postId =>
        postId ? this.dataService.getComments(postId) : of([])
      ),
      map(data => data || []) // Ensure comments is an empty array if no postId
    );

    // selectedPostId$ to update local property
    this.selectedPostId$.subscribe(postId => {
      this.selectedPostId = postId;
    });

    // selectedCommentId$ to update local property
    this.selectedCommentId$.subscribe(commentId => {
      this.selectedCommentId = commentId;
    });

    // For Mergemap
    this.dataService
      .getPostIds()
      .pipe(
        tap(ids => {
          this.postIds = ids;
          if (this.postIds.length > 0) {
            this.loadPostAndComments(this.postIds[0]);
          }
        }),
        catchError(error => {
          this.error = error;
          console.error('Error fetching post IDs:', error);
          return of([]); // fallback observable
        })
      )
      .subscribe();

    // For filter
    this.filteredPosts$ = this.myControl.valueChanges.pipe(
      startWith(''),
      switchMap(value =>
        this.posts$.pipe(
          map(posts => this._filter(posts, this._getFilterValue(value)))
        )
      )
    );
  }

  onPostSelect(postId: number): void {
    this.selectedPostId$.next(postId);
  }

  onCommentSelect(commentId: number): void {
    this.selectedCommentId$.next(commentId);
  }

  onPostIdChange(event: any): void {
    const selectedId = +event.target.value;
    this.loadPostAndComments(selectedId);
  }

  loadPostAndComments(postId: number): void {
    this.dataService.getPostWithComments(postId).subscribe(
      result => {
        this.post = result.post;
        this.comments = result.comments;
      },
      error => {
        this.error = error;
        console.error('Error:', error);
      }
    );
  }

  // For filter
  private _filter(posts: product[], filterValue: string): product[] {
    return posts.filter(post =>
      post.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  private _getFilterValue(value: string | product | null): string {
    if (typeof value === 'string') {
      return value;
    } else if (value && 'title' in value) {
      return value.title;
    } else {
      return '';
    }
  }

  displayFn(post: product): string {
    return post && post.title ? post.title : '';
  }
}
