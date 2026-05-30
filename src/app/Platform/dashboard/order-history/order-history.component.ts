import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { OrderHistory, OrderHistoryFilterModel, OrderHistoryModel } from '../../../Core/common/CommonModels/OrderModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { take } from 'rxjs';
import { Modal } from 'bootstrap'
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule,MatTooltipModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {


  private orderService = inject(OrderService);
  private toasterService = inject(ToastrService);
  private authService = inject(AuthService);
  today: string = new Date().toISOString().split('T')[0];  // 'YYYY-MM-DD'
  user: JwtPayload | null = null;
  filterModel: OrderHistoryFilterModel = new OrderHistoryFilterModel();
orderHistory: OrderHistory = {
  orders: [],
  orderStatus: []
};  selectedOrderId:number=0;
  orderDetails:any[]=[];
  selectedStatusId:number|null=0;
  totalOrderPrice:number=0;
  constructor() {
    // Initialize filterModel if needed
   
    // this.getOrderHistory();

  }
  
  ngOnInit(): void {
     this.authService.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    this.getAllOrderStatus();
    this.getOrderHistory();
  }


  get isInvalidDateRange(): boolean {
    if (!this.filterModel.fromDate || !this.filterModel.toDate) return false;
    return new Date(this.filterModel.fromDate) > new Date(this.filterModel.toDate);
  }

  // getOrderHistory() {
  //   if (this.isInvalidDateRange) {
  //     this.toasterService.error("Invalid date range selected. Please select a valid range.")
  //     this.filterModel.fromDate = new Date();
  //     this.filterModel.toDate = null;
  //     return;
  //   }
  //   this.orderService.getOrderHistory(this.filterModel).subscribe((res: any) => {
  //     if (res.statusCode == 200) {
  //       
  //       this.orderHistory = res.data as OrderHistory;
  //     }
  //     else {
  //       this.orderHistory.orders=[];
  //       this.orderHistory.orderStatus=[];
  //     }
  //   })
  // }

  getAllOrderStatus() {
    this.orderService.getOrderStatus().subscribe((res:any)=>{
      if(res.statusCode===200){
        this.orderHistory.orderStatus = res.data;
        
      }
      return 'Unknown';
    });
  }
  getOrderHistory() {
    if (this.isInvalidDateRange) {
      this.toasterService.error("Invalid date range selected. Please select a valid range.");
      this.filterModel.fromDate = new Date();
      this.filterModel.toDate = null;
      return;
    }

    this.orderService.getOrderHistory(this.filterModel).subscribe({
      next: (response: any) => {
        if (response.statusCode === 200 && response.data) {
          this.orderHistory.orders = response.data.orders || [];
           
          // this.selectedStatusId = this.filterModel.statusId  ? Number(this.filterModel.statusId) : null;;
        } else {
          this.orderHistory.orders = [];;
        }
      },
      error: () => {
        this.orderHistory.orders = [];
      }
    });
}

  onStatusChange(order:any){
    const orderStatusObj = {
      screenName:'sales',
      orderId : order.orderId,
      statusId:order.statusId
    }
    this.orderService.changeOrderStatus(orderStatusObj).subscribe((res:any)=>{
      if(res.statusCode===200){
        this.toasterService.success(res.message);
        this.getOrderHistory();
      }
    })
    // API Call
  }
fetchOrderDetails(order:any){
this.selectedOrderId = order.orderId;

    this.orderService.getOrderHistoryDetails(order.orderId).subscribe((res) => {
      if(res.statusCode==200){

        this.orderDetails = res.data;
        this.totalOrderPrice = res.data[0].totalPrice;
      }

      // Open Bootstrap modal
      const modalEl = document.getElementById('orderDetailsModal');
      if (modalEl) {
        
        const modal = new Modal(modalEl,{
           backdrop: true,  // default: true, allows click outside to close
    keyboard: true 
        });
        modal.show();
      }
    });
}

  resetFilter() {
    this.filterModel = new OrderHistoryFilterModel();
    this.getOrderHistory(); // Refresh the order history after resetting the filter
  }

  onFilterStatusChange(event:any){
    
 const value = event.target.value;
if(value === '0') {
  // this.selectedStatusId = 0;
   this.selectedStatusId = value ;

  // Update filter model
  this.filterModel.statusId = null;
}
else{
// Convert to number or set null if empty
  this.selectedStatusId = value ;

  // Update filter model
  this.filterModel.statusId = this.selectedStatusId;

}
  
  // Fetch new order history with selected status filter
  this.getOrderHistory();
  }

printPage() {
  window.print();
}


}
