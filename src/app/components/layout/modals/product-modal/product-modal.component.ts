import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/reusable/utility.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {


  productForm:FormGroup
  action:string = 'Guardar'
  actionButton:string = 'Save'
  categoriesList:Category[] = []
  productStatus = [{status: 'Activo', value: 1}, {status: 'Inactivo', value: 0}]

  constructor(
    private currentModal:MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public productData:Product,
    private formBuilder:FormBuilder,
    private _categoryService:CategoryService,
    private _productService:ProductService,
    private _utilityService:UtilityService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      stock: ['', Validators.required],
      price: ['', Validators.required],
      isActive: ['1', Validators.required]
    })


    if(this.productData != null){
      this.actionButton = 'Update'
      this.action = 'Editar'
    }

    this._categoryService.getAll().subscribe({
      next: (data) => {
        if(data.status) this.categoriesList = data.value
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    if(this.productData != null) {
      this.productForm.patchValue({
        name: this.productData.name,
        categoryId: this.productData.categoryId,
        stock: this.productData.stock,
        price: this.productData.price,
        isActive: this.productData.isActive.toString()
      })
    }
  }

  save() {
    const product:Product = {
      id:  this.productData?.id || 0,
      name: this.productForm.value.name,
      categoryId: this.productForm.value.categoryId,
      price: this.productForm.value.price,
      stock: this.productForm.value.stock,
      isActive: Number(this.productForm.value.isActive),
      categoryDescription: '',
    }

    if(this.productData == null) {
      this._productService.create(product).subscribe({
        next: (data) =>  {
          if(data.status) {
            this._utilityService.showAlert("El producto fue registrado", "Éxito")
            this.currentModal.close("true")
          } else {
            this._utilityService.showAlert("No se pudo registrar el producto", "Error")
          }
        },
        error: (e) => {}
      })
    } else {
      this._productService.update(product).subscribe({
        next: (data) =>  {
          if(data.status) {
            this._utilityService.showAlert("El producto fue actualizado con éxito", "Éxito")
            this.currentModal.close("true")
          } else {
            this._utilityService.showAlert("No se pudo actualizar el producto", "Error")
          }
        },
        error: (e) => {}
      })
    }
  }

}
