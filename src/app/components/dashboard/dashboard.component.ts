import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { product } from '../types/product.type';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject, delay, Observable, of, switchMap} from 'rxjs';
import { comment } from '../types/comment.type';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private baseUrl = `https://jsonplaceholder.typicode.com`;

  httpClient = inject(HttpClient);
  selectedProductId: number | null = null;
  selectedCommentId: number | null = null;
  posts$ = this.getdata();
  comment$: Observable<comment[]> = of([]); // Start with an empty observable
  selectedProduct$ = new BehaviorSubject<number>(5);

  ngOnInit(): void {
    this.comment$ = this.selectedProduct$.pipe(
      switchMap(value => this.getCommentData(value))
    );
  }

  getdata() {
    return this.httpClient.get<product[]>(`${this.baseUrl}/posts`).pipe(
      delay(1000), // Delay in milliseconds (2000ms = 2 seconds)
    );
  }

  getCommentData(productId: number) {
    return this.httpClient
      .get<comment[]>(`${this.baseUrl}/posts/${productId}/comments`)
      .pipe(
        delay(1000), // Delay in milliseconds (2000ms = 2 seconds)
      );
  }

  productChange(event: Event) {
    // this.comment$ = of([]);
    const selectedProduct = +(event.target as HTMLSelectElement).value;
    this.selectedProduct$.next(+selectedProduct);
  }

  onSubmit(data: NgForm) {
    console.log(data.valid);
    console.log(data.value);
  }
}