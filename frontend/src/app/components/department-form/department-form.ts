import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DepartmentService, Department } from '../../services/department';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './department-form.html',
  styleUrls: ['./department-form.css'],
})
export class DepartmentFormComponent implements OnInit {
  id?: number;
  title = 'Create Department';
  submitting = false;

  // Declare but don't initialize here to avoid TS2729
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: DepartmentService,
    private toast: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Safe initialization using injected FormBuilder
    this.form = this.fb.group({
      dept_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(300)]],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.title = 'Update Department';
      this.api.get(this.id).subscribe({
        next: (d) =>
          this.form.patchValue({
            dept_name: d.dept_name,
            description: d.description || '',
          }),
        error: () => this.toast.open('Failed to load department', 'Close', { duration: 3000 }),
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;

    const payload = this.form.value as Department;
    const request$ = this.id
      ? this.api.update(this.id, payload)
      : this.api.create({ ...payload, status: true });

    request$.subscribe({
      next: () => {
        this.toast.open(this.id ? 'Updated successfully' : 'Created successfully', 'Close', {
          duration: 2500,
        });
        this.router.navigate(['/departments']);
      },
      error: (err) => {
        const msg = err?.error?.dept_name?.[0] || 'Save failed';
        this.toast.open(msg, 'Close', { duration: 3000 });
      },
      complete: () => (this.submitting = false),
    });
  }

  cancel(): void {
    this.router.navigate(['/departments']);
  }
}
