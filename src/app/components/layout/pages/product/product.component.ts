import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ProductModalComponent } from '../../modals/product-modal/product-modal.component';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/reusable/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {
  tableColumns: string[] = ['name', 'category', 'stock', 'price', 'status', 'actions']
  INITIAL_DATA:Product[] = []
  productsList = new MatTableDataSource(this.INITIAL_DATA)
  @ViewChild(MatPaginator) tablePagination!:MatPaginator

  constructor(
    private dialog: MatDialog,
    private _productService: ProductService,
    private _utilityService: UtilityService
  ) { }

  getProducts(){
    this._productService.getAll().subscribe(
      {
        next: (data) => {
          if(data.status) {
            this.productsList.data = data.value
          } else {
            this._utilityService.showAlert('No se encontraron datos', "Opps!")
          }
        },
        error: e => console.log(e)
      }
    )
  }

  ngAfterViewInit(): void {
    this.productsList.paginator = this.tablePagination
  }

  ngOnInit(): void {
    this.getProducts()
  }

  applyTableFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value

    this.productsList.filter = filterValue.trim().toLocaleLowerCase()
  }

  createProduct(){
    this.dialog.open(ProductModalComponent, {
      disableClose:true
    }).afterClosed().subscribe(result => {
      if(result == 'true') this.getProducts()
    })
  }

  editProduct(product: Product){
    this.dialog.open(ProductModalComponent, {
      disableClose:true,
      data: product
    }).afterClosed().subscribe(result => {
      if(result == 'true') this.getProducts()
    })
  }

  deleteProduct(product: Product){
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: product.name,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.isConfirmed) {
        this._productService.delete(product.id).subscribe({
          next: data => {
            if(data.status) {
              this._utilityService.showAlert(
                "El producto fue eliminado exitosamente",
                "Producto Eliminado"
              )
              this.getProducts()
            } else {
              this._utilityService.showAlert(
                "No se pudo eliminar el producto",
                "Error al eliminar el producto"
              )
            }
          },
          error: e => console.error(e)

        })
      }
    })
  }

}
