/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service.service';

@Component({
  selector: 'app-retry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retry.component.html',
  styleUrl: './retry.component.scss'
})
export class RetryComponent  implements OnInit{
  data: any;
  error: string | null = null;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // For Retry
    this.dataService.getDataForRetry().subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (err) => {
        this.error = err.message;
      }
    });
  }
}
