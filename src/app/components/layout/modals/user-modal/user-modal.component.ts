import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';

import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import { UtilityService } from 'src/app/reusable/utility.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {

  userForm:FormGroup
  hidePassword:boolean = true
  action:string = 'Guardar'
  actionButton:string = 'Save'
  rolesList:Role[] = []
  userStatus = [{status: 'Activo', value: 1}, {status: 'Inactivo', value: 0}]

  constructor(
    private currentModal:MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public userData:User,
    private formBuilder:FormBuilder,
    private _roleService:RoleService,
    private _userService:UserService,
    private _utilityService:UtilityService
  ) {
    this.userForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      roleId: ['', Validators.required],
      password: ['', Validators.required],
      isActive: ['1', Validators.required]
    })

    if(this.userData != null){
      this.actionButton = 'Update'
      this.action = 'Editar'
    }

    this._roleService.getAll().subscribe({
      next: (data) => {
        if(data.status) this.rolesList = data.value
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    if(this.userData != null) {
      this.userForm.patchValue({
        fullName: this.userData.fullName,
        email: this.userData.email,
        roleId: this.userData.roleId,
        password: this.userData.password,
        isActive: this.userData.isActive.toString()
      })
    }
  }

  save() {
    const user:User = {
      id:  this.userData?.id || 0,
      fullName: this.userForm.value.fullName,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      isActive: Number(this.userForm.value.isActive),
      roleId: this.userForm.value.roleId,
      roleDescription: '',
    }

    if(this.userData == null) {
      this._userService.create(user).subscribe({
        next: (data) =>  {
          if(data.status) {
            this._utilityService.showAlert("El usuario fue registrado", "Éxito")
            this.currentModal.close("true")
          } else {
            this._utilityService.showAlert("No se pudo registrar el usuario", "Error")
          }
        },
        error: (e) => {}
      })
    } else {
      this._userService.update(user).subscribe({
        next: (data) =>  {
          if(data.status) {
            this._utilityService.showAlert("El usuario fue actualizado con éxito", "Éxito")
            this.currentModal.close("true")
          } else {
            this._utilityService.showAlert("No se pudo actualizar el usuario", "Error")
          }
        },
        error: (e) => {}
      })
    }
  }


}
