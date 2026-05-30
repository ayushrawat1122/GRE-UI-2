import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-order-confirm-modal',
  imports: [],
  templateUrl: './order-confirm-modal.component.html',
  styleUrl: './order-confirm-modal.component.css'
})
export class OrderConfirmModalComponent {
 @ViewChild('modalElement') modalElement!: ElementRef;

  @Output() closed: EventEmitter<void> = new EventEmitter();
 countdown: number = 3;
 @Input() orderType:string =  ''; 
  private intervalId: any;
  private modalInstance: any;

  show(): void {
    this.countdown = 3;

    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    this.modalInstance.show();

    // Start countdown
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.modalInstance.hide();
      }
    }, 1000);

    // Emit when modal fully hides
    this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.closed.emit();
    }, { once: true });
  }
}
