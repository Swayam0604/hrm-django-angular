import { DepartmentService, Department } from '../../services/department';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  templateUrl: './department-list.html',
  styleUrls: ['./department-list.css'],
})
export class DepartmentListComponent implements OnInit {
  displayedColumns = ['sr', 'dept_name', 'description', 'status', 'actions'];
  data: Department[] = [];
  loading = false;
  search = '';
  includeInactive = false;
  total = 0;

  stats = { total: 0, active: 0, inactive: 0 };

  constructor(private api: DepartmentService, private router: Router, private toast: MatSnackBar) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.api.list(this.search, this.includeInactive).subscribe({
      next: (res) => {
        this.data = res.results ?? res; // works with/without pagination
        this.total = res.count ?? this.data.length;
        const active = this.data.filter((d) => d.status !== false).length;
        const inactive = this.data.filter((d) => d.status === false).length;
        this.stats = { total: this.total, active, inactive };
      },
      error: () => this.toast.open('Failed to load departments', 'Close', { duration: 3000 }),
      complete: () => (this.loading = false),
    });
  }

  clearSearch(): void {
    this.search = '';
    this.fetch();
  }

  create(): void {
    this.router.navigate(['/departments/new']);
  }

  edit(row: Department): void {
    if (!row.id) return;
    this.router.navigate(['/departments', row.id, 'edit']);
  }

  remove(row: Department): void {
    if (!row.id) return;
    const ok = confirm('Deactivating this department will hide it for users. Continue?');
    if (!ok) return;
    this.api.softDelete(row.id).subscribe({
      next: () => {
        this.toast.open('Department deactivated', 'Close', { duration: 2500 });
        this.fetch();
      },
      error: () => this.toast.open('Delete failed', 'Close', { duration: 3000 }),
    });
  }
}
