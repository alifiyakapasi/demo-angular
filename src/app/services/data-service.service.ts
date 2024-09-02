/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, mergeMap, retryWhen, scan, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private commentsUrl = 'https://jsonplaceholder.typicode.com/posts/1/comments';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.postsUrl);
  }

  getComments(postId: number): Observable<any[]> {
    const url = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
    return this.http.get<any[]>(url);
  }

  getPostIds(): Observable<number[]> {
    return this.http.get<any[]>(this.postsUrl).pipe(
      map(posts => posts.map(post => post.id))
    );
  }

  getPostWithComments(postId: number): Observable<{ post: any, comments: any[] }> {
    const postUrl = `${this.postsUrl}/${postId}`;
    const commentsUrl = `${this.postsUrl}/${postId}/comments`;

    return this.http.get<any>(postUrl).pipe(
      mergeMap(post =>
        this.http.get<any[]>(commentsUrl).pipe(
          map(comments => ({ post, comments }))
        )
      )
    );
  }


  getData1(): Observable<{ id: number, title: string }> {
    return this.http.get<{ id: number, title: string }>(`${this.postsUrl}/1`).pipe(
      map(response => ({
        id: response.id,
        title: response.title
      }))
    );
  }
  getData2(): Observable<{ id: number, name: string }[]> {
    return this.http.get<any[]>(`${this.postsUrl}/1/comments`).pipe(
      map(comments => comments.map(comment => ({
        id: comment.id,
        name: comment.name
      })))
    ).pipe(delay(1000));
  }

  getDataForRetry(): Observable<any> {
    return this.http.get<any>(`${this.postsUrl}/1`).pipe(
      //retry(3), // Retry up to 3 times before failing
      retryWhen(errors =>
        errors.pipe(
          // Scan the number of retries
          scan((retryCount, error) => {
            if (retryCount >= 3) {
              throw error; // Re-throw the error after 3 retries
            }
            console.log(`Retrying... attempt ${retryCount + 1}`);
            return retryCount + 1;
          }, 0),
          // Delay between retries
          delay(1000) // Delay of 1 second between retries
        )
      ),
      catchError(error => {
        // Handle error and rethrow
        console.error('Error occurred:', error);
        return throwError(() => new Error('Failed to fetch data after multiple attempts'));
      })
    );
  }
  // getData1(): Observable<string> {
  //   return of('Data from Service 1').pipe(delay(1000)); // Simulating a delay
  // }
  // getData2(): Observable<number> {
  //   return of(42).pipe(delay(2000)); // Simulating a delay
  // }
}