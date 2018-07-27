import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  //public msgform: FormGroup;
  public msgform;
  isLoading = false;
  constructor(public toast: MatSnackBar) { }

  ngOnInit() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.msgform = new FormGroup({
            welcomeMessageLink: new FormControl('', [Validators.pattern(reg)]),
            playListNames: new FormControl('',[]),
            popUpMessage:new FormControl('',[]),
            rapidInstallerDisclaimer:new FormControl('',[]),
            welcomeMessage:new FormControl('',[]),
  }) 
  
  this.reloadData();
    
  }
reloadData(){
  this.fillForm().subscribe(res=>{
    this.isLoading = false;
  });
    
}

fillForm(): Observable<any>
{
  this.isLoading = true;
  let formData = this.msgform;
  let propName='';  
  let loader = this.isLoading;  
  let formDataModel= {
                 welcomeMessageLink:'',
                 playListNames:'',
                 popUpMessage:'',
                 rapidInstallerDisclaimer:'',
                 welcomeMessage:''
  };    
   return  Observable.create(observer => { firebase.database().ref('messages').once('value').then(function(snapshot) {
     snapshot.forEach(function(child :any){
     if(formDataModel[child.key] != undefined)  
     formDataModel[child.key] = child.val();
     });
     formData.setValue(formDataModel);
      observer.next({"success":true});
  }, error=>{
      observer.next({"success":false});
  })
  });
  }  

submitMessages(value)
{
  this.isLoading = true;
  let loader = this.isLoading;
  firebase.database().ref('messages').set(value).then(
        (success) => {
        this.openSnackBar('Updated messages','green-snackbar');  
        this.reloadData();
        },(error)=>{
        this.openSnackBar('Update failed','red-snackbar') ;
        }); 
 
}

 openSnackBar(msg,cls) {
    this.toast.open(msg, '', {
      duration: 5000,
      horizontalPosition: 'right',
      extraClasses: [cls]
    });
  }

}
