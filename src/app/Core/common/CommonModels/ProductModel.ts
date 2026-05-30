export class UserCartItem {
    productId: number = 0;
    orderCases: number = 0;
    orderCartons: number = 0;
}
export class UserPromoCartItem {
    productId: number = 0;
    productQuantity: number = 0;
    masterSizeId:number = 0;
}
export class OrderPriceValidating {
    ProductId: number = 0;
    ProductName: string = '';
    ProductImageName: string = '';
    Description: string = '';
    OrderCases: number = 0;
    OrderCartons: number = 0;
    PricePerCase: number = 0;
    PricePerCarton: number = 0;
    ActualSubTotal: number = 0;
}


export class PromoOrderPriceValidating {
    ProductId: number = 0;
    ProductName: string = '';
    ProductImageName: string = '';
    Description: string = '';
    ProductQuantity: number = 0;
    ProductPrice:number=0;
    SubTotal: number = 0;
}

export class SalesReportFilterModel{
    PageNumber:number=1;
    pageSize:number=5;
    ReportTypeId:number|null=1;
    TerritoryIds:string|null=null;
    StoreIds:string|null=null;
    ProductIds:string|null=null;
        FromDate: string|null  = null;
    ToDate: string|null  = null; 
  NoPagination:boolean=false;
}

export class SalesReportModel{
    storeName!:string;
    productName!:string;
    totalSales!:number;
    territoryName!:string;
    cartons!:number;
    cases!:number;
    sales!:number;
    globalTotal!:number
    salesPercentage!:number
    territoryId!:number;
    storeId!:number;
    productId!:number;
    fromDate!:string;
    toDate!:string;
    dateRange!:string;
}
export class SalesReportModelNoPagination{
    storeName!:string;
    productName!:string;
    totalSales!:number;
    territoryName!:string;
    cartons!:number;
    cases!:number;
    sales!:number;
    globalTotal!:number
    salesPercentage!:number
    territoryId!:number;
    storeId!:number;
    productId!:number;
    
}
