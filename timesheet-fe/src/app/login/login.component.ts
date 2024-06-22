import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';

declare var google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  zone!: NgZone;

  loginsuccess: any = false;
  loginfail: any;
  constructor(private router: Router, private apiService: ApiService,private fb:FormBuilder) { }
  loginForm: FormGroup = this.fb.group({
    email: [null,[Validators.required,  Validators.email]],
    password: [null,Validators.required]
  });

  
  ngOnInit() {
      google.accounts.id.initialize({
        client_id: '18876675663-voovm072j7tvotaesbfpfljtu3q579j4.apps.googleusercontent.com',
        callback: (resp: any) => {
          this.handelLoginGoogle(resp)
        }
      });
      google.accounts.id.renderButton(document.getElementById("google-btn"), {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangle',
        width: 350
      })
    }

  private decodeToken(token: string){
    return JSON.parse(window.atob(token.split(".")[1]))
  }

  setDataLocal(token: any){
    localStorage.setItem('token', token)
    let payload=this.apiService.getpayload();
    localStorage.setItem('currentemployeeemail',payload.email);
    localStorage.setItem('currentemployeeid',payload.id);
    this.loginForm.reset();
  }

  handelLoginGoogle(response: any){
    if(response){
      //decode the token
      const payload = this.decodeToken(response.credential)
      console.log(payload)
      this.apiService.loginGG(payload).subscribe((response: any) => {
        this.setDataLocal(response.acces_token)
        setTimeout(() => {
            this.router.navigate(['app/timesheet']);
        }, 2000);
      },
      (error) => {
        this.loginfail = 'Account does not exist!'
        console.log(error.error.message)
      }
      )
    }
  }

  

  login() {
    // if (!this.loginForm.valid) {
    //   console.log('Invalid'); return;
    // }
    this.apiService.login(this.loginForm.value)
      .subscribe(
        (response: any) => {
          this.loginsuccess = "Login Success-Going to Dashboard";
          this.setDataLocal(response.acces_token)
          setTimeout(() => {
            this.router.navigate(['app/timesheet']);
          }, 2000);
          
        },
        (error) => { 
          this.loginfail = "Invalid Username/Password";
          console.log(error.error.message); }
      );
  }
  get form(){
    return this.loginForm.controls;
  }
  // clearForm(){
  //   (<HTMLFormElement>document.getElementById("loginform")).reset();
  //  }

}
