/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject, catchError, map, of, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss'
})
export class ImagesComponent implements OnInit {
  albums$: Observable<any[]> = new Observable<any[]>();
  photos$: Observable<any[]> = new Observable<any[]>();
  private albumIdSubject = new Subject<number>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.albums$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/albums').pipe(
      // tap(data => console.log('Albums loaded:', data)),
      map(data => data.slice(0, 50)),
      catchError(error => {
        console.error('Error fetching albums:', error);
        return of([]);
      })
    );

    this.photos$ = this.albumIdSubject.pipe(
      switchMap(albumId => 
        this.http.get<any[]>(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`).pipe(
          tap(data => console.log('Photos loaded:', data)),
          map(data => data.slice(0, 5)),
          catchError(error => {
            console.error('Error fetching photos:', error);
            return of([]);
          })
        )
      )
    );
  }

  onAlbumChange(event: any): void {
    const albumId = +event.target.value;
    this.albumIdSubject.next(albumId);
  }
}
