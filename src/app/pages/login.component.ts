import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'messages',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //public msgform: FormGroup;
  public loginform;
  constructor(public toast: MatSnackBar,public af: AngularFireAuth, public router:Router) { }

  ngOnInit() {
   
    this.loginform = new FormGroup({
            username: new FormControl('', [Validators.email,Validators.required]),
            password: new FormControl('',[Validators.required])
  }) 
      
  }

Login(value)
{
  this.af.auth.signInWithEmailAndPassword(value.username,value.password)
      .then(
        (data) => {
        let userdata = {
          userId:data.user.uid,
          email:data.user.email
        };
        localStorage.setItem('troypoint',JSON.stringify(userdata));
         this.router.navigate(["/fileupload"]);
      }).catch(
        (err) => {
        this.openSnackBar(err,'red-snackbar');
      })
}
 openSnackBar(msg,cls) {
    this.toast.open(msg, '', {
      duration: 5000,
      horizontalPosition: 'right',
      extraClasses: [cls]
    });
  }

}
