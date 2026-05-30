export class OrderHistoryModel {
  date!: Date;
  submittedBy!: string;
  numberOfProducts!: number;
  totalPrice!: number;
  userClassification!:string;
  storeName!: string;
  statusId!:number;
  statusName!: string;
}
export class OrderHistory{
  orders:OrderHistoryModel[]|null=null;
  orderStatus:OrderStatus[]|null=null;
}
export class OrderStatus{
  statusId!:number;
  statusName!:string;
}

export class OrderHistoryFilterModel {
  fromDate: Date|null  = null;
  toDate: Date|null  = null; 
  statusId:number|null=null;
}