import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { UtilityService } from 'src/app/reusable/utility.service';

import { Product } from 'src/app/interfaces/product';
import { Sale } from 'src/app/interfaces/sale';
import { SaleDetails } from 'src/app/interfaces/sale-details';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
