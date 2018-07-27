import { Component, OnInit,ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ImageUploadComponent,FileHolder} from 'angular2-image-upload/lib/image-upload/image-upload.component';
import * as firebase from 'firebase/app';
import * as fbstorage from 'firebase';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  public fileform;
  paginationConfig = {
    pageLength: 0,
    pageSize: 5,
    pageIndex: 0
  };
  public fileInf: any;
  fileuploaded = false;
  isUpdate = false;
  editedFileinfo={id:null,imgUrl:null};
  images =[];
  @ViewChild('imageUpload') private imageUpload: any;
  @ViewChild(ImageUploadComponent) imageUploadComponent: ImageUploadComponent;
  dummdata = [];
  pageData= [];
  constructor(private _http: Http,private sanitizer :DomSanitizer) { }

ngOnInit() {
    this.setFrom();
}

navigatetoLink(url:string)
  {
   url = url.indexOf('http') > -1 ? url : "//"+url;
   window.open(url,'_blank');
}

setPagination(data)
  {
     this.pageData = data;
          this.dummdata  = this.pageData.slice(this.paginationConfig.pageIndex * this.paginationConfig.pageSize,
              (this.paginationConfig.pageIndex * this.paginationConfig.pageSize) + this.paginationConfig.pageSize);
                this.paginationConfig.pageLength = this.pageData.length;    
}

getinfo(id): Observable<any>
  {
    let formData = this.fileform;
    let imgUrl;
    let formDataModel ={
      fileName:'',
      cloudDownloadPath:'',
      description:''      
       };
     return  Observable.create(observer => {
       firebase.database().ref('fileinfo'+'/'+id).once('value').then(function(snapshot) {
       snapshot.forEach(function(child :any){
       if(formDataModel[child.key] != undefined)  
       formDataModel[child.key] = child.val();
       else if(child.key =='iconPath')
       imgUrl = child.val(); 
       })
        observer.next({"imgUrl":imgUrl,"formdata":formDataModel});
      
    })
     });
}

editRecord(id)
  {
    this.fileInf = null; 
    this.isUpdate = true;
    this.getinfo(id).subscribe(data=>{
      this.images=[];
      this.imageUpload.deleteAll();
      this.editedFileinfo.id = id;
      this.editedFileinfo.imgUrl = data.imgUrl;
      this.images.push(data.imgUrl);
      this.fileform.setValue(data.formdata);
     })
}

deleteRecord(id)
  {
    firebase.database().ref('fileinfo'+'/'+id).remove().then((snap) => {
      this.setFrom();
    }).catch((err) => {
         console.log(err);
       });
}

updateInfo(value)
  {
   let flag =  this.fileInf !=null ? true : false;
   value.iconPath =  flag ? '':this.editedFileinfo.imgUrl;
   this.updateFileInfo(this.editedFileinfo.id, value,flag)
}

  cancelUpdate(){
    this.setFrom();
  }

loadData(){
    this.getData().subscribe(res=>{
    this.setPagination(res.data);
    })
}

pageChange(event) {
    this.setFrom();
    this.paginationConfig = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      pageLength: this.pageData.length
    };
      this.dummdata = this.pageData.slice(this.paginationConfig.pageIndex * this.paginationConfig.pageSize,
      (this.paginationConfig.pageIndex * this.paginationConfig.pageSize) + this.paginationConfig.pageSize);
}

setFrom()
  {
   this.isUpdate =false; 
   const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'; 
   this.fileform = new FormGroup({
         fileName : new FormControl('',[Validators.required]),
         cloudDownloadPath  :new FormControl('', [Validators.pattern(reg),Validators.required]),
         description:new FormControl('',[Validators.required])
        
    });
   this.fileuploaded = false;
   this.editedFileinfo={id:null,imgUrl:null};
   this.imageUpload.deleteAll();
   this.loadData();
}

uploadFileImage()
  {
    if(this.imageUploadComponent.fileCounter < 1 && this.imageUploadComponent.uploadedFiles.length < 1)
    this.imageUpload.inputElement.nativeElement.click();
}

updateFileInfo(id,value,flag)
  {
      let key =  firebase.database().ref().push().key;
      if(flag)
         this.uploadfleInfo(this.fileInf,key).subscribe(res=>{
      if(res.success)
      { 
      value.iconPath = res.url;  
      firebase.database().ref(`fileinfo/${id}`).set(value).then(
        (success) => {
         this.setFrom();
        });
        }
        });
    else
       firebase.database().ref(`fileinfo/${id}`).set(value).then(
        (success) => {
         this.setFrom();
        });
}

submitFileInfo(value)
  {
    value.activeLink = true;
    let key =  firebase.database().ref().push().key;
    this.uploadfleInfo(this.fileInf,key).subscribe(res=>{
      if(res.success)
      { 
      value.iconPath = res.url;  
      firebase.database().ref('fileinfo').push().set(value).then(
        (success) => {
         this.setFrom();
        });
       }
      });
}

public onUploadFinished(file: FileHolder) {
     this.fileuploaded = true; 
     this.fileInf = file;    
}

public onRemoved(file: FileHolder) {
     this.fileuploaded = false; 
     this.imageUploadComponent.deleteAll();
     this.imageUploadComponent.uploadedFiles= [];
} 

uploadfleInfo(upload,key): Observable<any>{
        let imgUrl;
        const storageRef = fbstorage.storage().ref();
        const uploadTask = storageRef.child(`${key+upload.file.name}`).put(upload.file);
        console.log(uploadTask);
       return  Observable.create(observer => { uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                const snap = snapshot as firebase.storage.UploadTaskSnapshot;
                upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100;
            },
            (error) => {
              observer.next({"success":false});
                       },
            () => {
              firebase.storage().ref().child(`${key+upload.file.name}`).getDownloadURL().then(function(url) {
               imgUrl = url;
               }).then(sucess => {
               observer.next({"success":true,"url":imgUrl});
              });
            },
       )
        });
}

getData() : Observable<any>
    {
     let fileArray = [];
     let fData = {'id':''}; 
     return  Observable.create(observer => {firebase.database().ref('fileinfo').once('value').then(function(snapshot) {
     snapshot.forEach(function(child :any){
     fData = {id:''};  
     fData = child.val();
     fData.id = child.key;
     fileArray.push(fData);
     fileArray = fileArray.reverse();
     });
    
     }).then(success=>{
         observer.next({"success":true,"data":fileArray});
     }, error=>{
         observer.next({"success":false});
     })
     });
    }


}
