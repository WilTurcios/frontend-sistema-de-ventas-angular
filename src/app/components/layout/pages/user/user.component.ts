import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { UserModalComponent } from '../../modals/user-modal/user-modal.component';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/reusable/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  tableColumns: string[] = ['fullName', 'email', 'roleDescription', 'status', 'actions']
  INITIAL_DATA:User[] = []
  usersList = new MatTableDataSource(this.INITIAL_DATA)
  @ViewChild(MatPaginator) tablePagination!:MatPaginator

  constructor(
    private dialog: MatDialog,
    private _userService: UserService,
    private _utilityService: UtilityService
  ) { }

  getUsers(){
    this._userService.getAll().subscribe(
      {
        next: (data) => {
          if(data.status) {
            this.usersList.data = data.value
          } else {
            this._utilityService.showAlert('No se encontraron datos', "Opps!")
          }
        },
        error: e => console.log(e)
      }
    )
  }
  ngAfterViewInit(): void {
    this.usersList.paginator = this.tablePagination
  }

  ngOnInit(): void {
    this.getUsers()
  }

  applyTableFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value

    this.usersList.filter = filterValue.trim().toLocaleLowerCase()
  }

  createUser(){
    this.dialog.open(UserModalComponent, {
      disableClose:true
    }).afterClosed().subscribe(result => {
      if(result == 'true') this.getUsers()
    })
  }

  editUser(user: User){
    this.dialog.open(UserModalComponent, {
      disableClose:true,
      data: user
    }).afterClosed().subscribe(result => {
      if(result == 'true') this.getUsers()
    })
  }

  deleteUser(user: User){
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: user.fullName,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.isConfirmed) {
        this._userService.delete(user.id).subscribe({
          next: data => {
            if(data.status) {
              this._utilityService.showAlert(
                "El usuario fue eliminado exitosamente",
                "Usuario Eliminado"
              )
              this.getUsers()
            } else {
              this._utilityService.showAlert(
                "No se pudo eliminar el usuario",
                "Error al eliminar el usuario"
              )
            }
          },
          error: e => console.error(e)

        })
      }
    })
  }

}
