import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../Core/common/CommonModels/UserModel';
import { AccountService } from '../Services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EncryptionUtil } from '../../../Core/common/CommonMethods/encryptdecrypt';
import { ConfirmationModalComponent } from '../../../Core/common/confirmation-modal/confirmation-modal.component';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { take } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginationComponent } from '../../../Core/common/pagination/pagination.component';
import { UserFilterModel } from '../territories/territories.component';

@Component({
  selector: 'app-users',
  imports: [MatTooltipModule,CommonModule,ConfirmationModalComponent,PaginationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
users:User[]=[];
loggeduser:JwtPayload | null = null;
private accountService = inject(AccountService);
private authService = inject(AuthService);
private toastrService = inject(ToastrService);
private router = inject(Router);
filterModel: UserFilterModel = new UserFilterModel();
totalRecords: number = 0;
pageSize: number = 5;
page: number = 1;

selectedUser: any;
  constructor() {}

  ngOnInit(): void {
     this.authService.user$.pipe(take(1)).subscribe(user => {
            this.loggeduser = user;
          });
    this.getAllUsers(this.filterModel);
  }

  getAllUsers(filterModel:any) {
    this.accountService.getAllUser(filterModel).subscribe((response: any) => {
      if (response.statusCode === 200) {
        if (response.data && response.data.length > 0) {

            this.users = response.data as User[];
            this.totalRecords = response.data[0].totalRecords;
            
        } else {
          this.toastrService.info(response.message || 'No users found.');
        }
      } else {
        this.toastrService.error(response.message);
      }
    });
  }
  onUpdateUser(email: any) {
    this.router.navigate(['/dashboard/account/update-user', EncryptionUtil.encrypt(email)]);
  }
  
setSelectedUser(user: any) {
  this.selectedUser = user;
}

handleDelete(isConfirmed: boolean) {
  if (isConfirmed && this.selectedUser) {
    this.accountService.deleteUser(this.selectedUser.userId).subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.toastrService.success(response.message);
        this.getAllUsers(this.filterModel); // Refresh the user list after deletion
      } else {
        this.toastrService.error(response.message);
      }
    }); 
  }
}
navigateToAddUser(){
  this.router.navigate(['/dashboard/account/add-user']);
}
 onPageChanged(event:any){
    
    this.page = event;
    this.filterModel.pageNumber=this.page;
    this.getAllUsers(this.filterModel)
  }
  onPageSizeChange(event:any){
     this.pageSize = event;
  this.filterModel.pageNumber = 1; // reset to first page
  this.filterModel.pageSize = this.pageSize;
    this.getAllUsers(this.filterModel)
  }

}

