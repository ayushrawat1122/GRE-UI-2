import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule,FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  pageSizes = [5, 10, 20, 50]; // dropdown options
  totalPages: number = 0;
  pages: number[] = [];

  ngOnChanges(): void {
    this.calculatePagination();
  }

  calculatePagination() {
     
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
  }

  goToPage(page: number): void {
     
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.pageChanged.emit(this.currentPage);
  }

  onPageSizeChange(newSize: number) {
     
    this.itemsPerPage = Number(newSize);
    this.currentPage = 1;
    this.calculatePagination();
    this.pageSizeChanged.emit(this.itemsPerPage);
  }
}
