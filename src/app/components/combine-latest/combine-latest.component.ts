/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service.service';

@Component({
  selector: 'app-combine-latest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combine-latest.component.html',
  styleUrl: './combine-latest.component.scss'
})
export class CombineLatestComponent implements OnInit{
  combinedData: { post: any; comments: any[] } | null = null;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // For combineLatest
    combineLatest([
      this.dataService.getData1(),
      this.dataService.getData2(),
    ]).subscribe({
      next: ([post, comments]) => {
        this.combinedData = { post, comments };
        console.log('Combined Data:', this.combinedData);
      },
      error: err => {
        this.error = 'Failed to load data';
        console.error('Error occurred:', err);
      },
    });
  }
}
