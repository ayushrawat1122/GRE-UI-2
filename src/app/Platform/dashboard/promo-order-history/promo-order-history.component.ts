import { Component, inject } from '@angular/core';
import { PromoProductsService } from '../Services/promo-products.service';
import { ToastrService } from 'ngx-toastr';
import { OrderHistory, OrderHistoryFilterModel, OrderHistoryModel } from '../../../Core/common/CommonModels/OrderModel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { take } from 'rxjs';
import { Modal } from 'bootstrap'
import { OrderService } from '../Services/order.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-promo-order-history',
  imports: [MatTooltipModule,CommonModule,FormsModule],
  templateUrl: './promo-order-history.component.html',
  styleUrl: './promo-order-history.component.css'
})
export class PromoOrderHistoryComponent {

  private promoOrderService = inject(PromoProductsService);
  private orderService = inject(OrderService);
  private toasterService = inject(ToastrService);
  orderDetails:any[]=[];
  totalOrderPrice:any;
  selectedOrderId:any;
  today: string = new Date().toISOString().split('T')[0];  // 'YYYY-MM-DD'
  user:JwtPayload | null = null;
  filterModel:OrderHistoryFilterModel = new OrderHistoryFilterModel();
    private authService = inject(AuthService);
 orderHistory: OrderHistory = {
  orders: [],
  orderStatus: []
};
  selectedStatusId:number|null=0;

  constructor() {
    // Initialize filterModel if needed
   
// this.authService.user$.pipe(take(1)).subscribe(user => {
//       this.user = user;
//     });
//     this.getOrderHistory();
    
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
  //     this.filterModel.fromDate = null;
  //     this.filterModel.toDate = null;
  //     return;
  //   }
  //   this.promoOrderService.getPromoOrderHistory(this.filterModel).subscribe((res:any)=>{
  //     if(res.statusCode==200 ){

  //       this.orderHistory = res.data as OrderHistory;
  //     }
  //     else{
  //       this.orderHistory.orders = [];
  //       this.orderHistory.orderStatus = [];
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
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    return;
  }

  this.promoOrderService.getPromoOrderHistory(this.filterModel).subscribe({
    next: (res: any) => {
      if (res.statusCode === 200 && res.data) {
        // Safely map with default empty arrays
        this.orderHistory.orders= res.data.orders;
      } else {
        // API returned error or no data
        this.orderHistory.orders= [] ;
      }

    },
    error: (err) => {
      console.error('Error fetching order history:', err);
        this.orderHistory.orders= [] ;
    }
  });
}


    
resetFilter(){
  this.filterModel = new OrderHistoryFilterModel();
  this.getOrderHistory(); // Refresh the order history after resetting the filter
}

onStatusChange(order: any) {
const orderStatusObj = {
      screenName:'promo',
      orderId : order.orderId,
      statusId:order.statusId
    }
    this.orderService.changeOrderStatus(orderStatusObj).subscribe((res:any)=>{
      if(res.statusCode===200){
        this.toasterService.success(res.message);
        this.getOrderHistory();
      }
    })
}
fetchOrderDetails(order:any){
this.selectedOrderId = order.orderId;

    this.orderService.getPromoOrderHistoryDetails(order.orderId).subscribe((res) => {
      if(res.statusCode==200){

        this.orderDetails = res.data;
      }
      this.totalOrderPrice = res.data[0].totalPrice;

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


}
