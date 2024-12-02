import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { UtilityService } from 'src/app/reusable/utility.service';

import { Product } from 'src/app/interfaces/product';
import { Sale } from 'src/app/interfaces/sale';
import { SaleDetails } from 'src/app/interfaces/sale-details';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  productsList: Product[] = []
  productListFilter: Product[] = []

  productsToSaleList: SaleDetails[] = []
  disableRegisterButton:boolean = false

  selectedProduct!:Product
  defaultPaymentMethod:string = 'Efectivo'
  totalAmount:number = 0

  formProductSale: FormGroup
  columns: string[] = ['product', 'price', 'total', 'quantity', 'actions']
  paymentMethods: string[] = ['Efectivo', 'Tarjeta']
  salesDetailsList = new MatTableDataSource(this.productsToSaleList)

  filterProducts(search:any) : Product[] {
    const value = typeof search == 'string' ? search.toLowerCase() : search.name.toLocaleLowerCase()

    return this.productsList.filter(item => item.name.toLocaleLowerCase().includes(value))
  }

  constructor(
    private formBuilder:FormBuilder,
    private _saleService:SaleService,
    private _productService:ProductService,
    private _utilityService:UtilityService
  ) {
    this.formProductSale = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: ['', Validators.required]
    })

    this._productService.getAll().subscribe({
      next: (data) => {

        if(data.status) {
          const list = data.value as Product[]

          this.productsList = list.filter(p => p.isActive == 1 && p.stock > 0)
        }
      },
      error: e => console.error(e)
    })

    this.formProductSale.get('product')?.valueChanges.subscribe(value => {
      this.productListFilter = this.filterProducts(value)
    })
  }

  ngOnInit(): void {
  }

  showProduct(product:Product):string{
    return product.name
  }

  productToSale(event:any){
    this.selectedProduct = event.option.value


  }

  addProductToSale(){
    const quantity: number = this.formProductSale.value.quantity
    const price: number = Number(this.selectedProduct.price)
    const total = quantity * price
    this.totalAmount = this.totalAmount + total

    this.productsToSaleList.push({
      productId: this.selectedProduct.id,
      productDescription: this.selectedProduct.name,
      quantity,
      price: String(price.toFixed(2)),
      total: String(total.toFixed(2))
    })

    this.salesDetailsList = new MatTableDataSource(this.productsToSaleList)

    this.formProductSale.patchValue({
      product: '',
      quantity: ''
    })
  }

  deleteProduct(saleDetails: SaleDetails){
    this.totalAmount = this.totalAmount - (Number(saleDetails.price) * saleDetails.quantity)
    this.productsToSaleList = this.productsToSaleList.filter(p => p.productId !== saleDetails.productId)

    this.salesDetailsList = new MatTableDataSource(this.productsToSaleList)
  }

  registerSale(){
    if(this.productsToSaleList.length > 0) {
      this.disableRegisterButton = true
    }

    const request: Sale = {
      paymentMethod: this.defaultPaymentMethod,
      total: String(this.totalAmount.toFixed(2)),
      saleDetails: this.productsToSaleList
    }

    console.log(request)

    this._saleService.register(request).subscribe({
      next: response => {
        if(response.status) {
          this.totalAmount = 0.00
          this.productsToSaleList = []
          this.salesDetailsList = new MatTableDataSource(this.productsToSaleList)

          Swal.fire({
            icon: 'success',
            title: 'Venta Registrada',
            text: `Número de venta ${response.value.documentNumber}`
          })
        } else {
          this._utilityService.showAlert("No se puedo registrar la venta", "Opps!")
          console.error(response)
        }
      },
      complete: () => {
        this.disableRegisterButton = false
      },
      error: e => console.error(e)
    })
  }



}
