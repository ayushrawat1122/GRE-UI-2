export interface User {
  email?: string;
  userId?: string;
  storeId: string;
  storeName?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  userClassification?: string;
  userType?: string;
  role?: string[];
  [key: string]: any;
}