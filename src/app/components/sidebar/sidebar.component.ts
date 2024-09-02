import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatExpansionModule,
    CommonModule,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel;
  isActive = false;
  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkActiveRoute();
      }
    });
  }

  checkActiveRoute(): void {
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/widgets/')) {
      this.panel.expanded = true;
      this.isActive = currentUrl.startsWith('/widgets/');
    } else {
      this.panel.expanded = false;
    }
  }
}