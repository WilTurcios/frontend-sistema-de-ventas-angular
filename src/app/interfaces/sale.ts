import { SaleDetails } from "./sale-details";

export interface Sale {
  id?: number,
  documentNumber: string,
  paymentMethod: string,
  registerDate: string,
  total: string,
  saleDetails: SaleDetails[]
}
