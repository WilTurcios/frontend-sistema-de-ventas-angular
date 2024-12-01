import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/interfaces/login-request';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/reusable/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  hidePassword:boolean = true;
  showLoading:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _userService: UserService,
    private _utilityService: UtilityService
  ) {
    this.loginForm = this.formBuilder.group({
      email:['', Validators.required],
      password:['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  login(){
    this.showLoading = true;

    const request:LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }

    this._userService.login(request).subscribe(
      {
        next: (response) => {
          if(response.status) {
            this._utilityService.saveUserSession(response.value)
            this.router.navigate(["pages"])
          } else {
            this._utilityService.showAlert("No se encontraron coincidencias", "Opps!")
          }
        },
        complete: () => {
          this.showLoading = false
        },
        error: () => {
          this._utilityService.showAlert("Hubo un error al autenticarte", "Opps!")
        }
     }
  )
  }

}
