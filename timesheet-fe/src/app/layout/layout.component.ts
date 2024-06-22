import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  user: any;
  role: string ='';

  constructor(private apiService: ApiService, private router:Router){
    this.apiService.getUserById().subscribe(response => {
      this.user = response;
      this.role = this.user.role;
    })
  }

  logOut(){
    this.apiService.logout();
    this.router.navigate(['login']);
  }
}
