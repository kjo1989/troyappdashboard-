import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileHolder,ImageUploadComponent} from 'angular2-image-upload/lib/image-upload/image-upload.component';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import * as fbstorage from 'firebase';
import 'rxjs/add/observable/forkJoin';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { MatPaginator } from '@angular/material';


@Component({
  selector: 'videoupload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.css']
})
export class VideoUploadComponent implements OnInit {
  public videoform;
  public playlist=[];
  thumbanilImg =[];
  fullImg=[];
  paginationConfig = {
    pageLength: 0,
    pageSize: 5,
    pageIndex: 0
  };
  editedFileinfo={id:null,imgUrl:null,thumbUrl:null};
  thumbnailUpload =false;
  thumbfileInf;  
  imageUploaded = false;
  imgfileInf;
  isUpdate =false; 
  @ViewChild('imgvideoUpload') private imagevideoUpload: any;
  @ViewChild('thumbimgUpload') private thumbimgUpload: any;
  @ViewChild(ImageUploadComponent) imageUploadComponent: ImageUploadComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dummdata = [];
  pageData = [];
  constructor() { }

ngOnInit() {
     this.setFrom();
     this.getPlaylistname().subscribe(data=>{
       if(data.success)
       this.playlist =data.playlist;
     });
     this.getData().subscribe(res=>{
          this.setPagination(res.data); 
        })
}
  
updateInfo(value)
  {
   value.thumbnailUrl =  this.thumbfileInf ? '':this.editedFileinfo.thumbUrl;
   value.fullImageUrl =  this.imgfileInf ? '' :this.editedFileinfo.imgUrl
   this.updateVideoInfo(this.editedFileinfo.id, value,this.thumbnailUpload|| this.imageUploaded)
}

navigatetoLink(url:string)
  {
   url = url.indexOf('http') > -1 ? url : "//"+url;
   window.open(url,'_blank');
}

cancelUpdate(){
    this.setFrom();
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

editRecord(id)
  {
    this.thumbfileInf = null;
    this.imgfileInf  = null;
    this.thumbnailUpload = false;
    this.imageUploaded = false;
    this.isUpdate =true; 
    this.getinfo(id).subscribe(data=>{
      this.imageUploadComponent.deleteAll();
      this.thumbimgUpload.deleteAll();
      this.fullImg=[];
      this.editedFileinfo={id:id,imgUrl:data.imgUrl[0],thumbUrl:data.imgUrl[1]};
      this.thumbanilImg =[];
      this.thumbanilImg.push(data.imgUrl[1])
      this.fullImg.push(data.imgUrl[0]);
      this.videoform.setValue(data.formdata);
     })
}

deleteRecord(id)
  {
    this.setFrom();
    firebase.database().ref('videoinfo'+'/'+id).remove().then((snap) => {
      this.getData().subscribe(res=>{
          this.setPagination(res.data);   
        });
    }).catch((err) => {
  });
}

getPlaylistname():Observable<any>
  {
     let playlists = [];
     return  Observable.create(observer => { firebase.database().ref('messages').once('value').then(function(snapshot) {
     snapshot.forEach(function(child :any){
     if(child.key =='playListNames') 
     playlists = child.val().split(',')
     });
     observer.next({"success":true,"playlist":playlists});
  }, error=>{
      observer.next({"success":false});
  })
  });
}
 
setFrom()
  {
    this.isUpdate =false; 
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.videoform = new FormGroup({
      videoName :new FormControl('',[Validators.required]),
      videoUrl :new FormControl('', [Validators.pattern(reg),Validators.required]),
      description:new FormControl('',[Validators.required]),
      playListName : new FormControl('',[Validators.required])   
    });
    this.thumbnailUpload =false;
    this.imageUploaded = false;
     this.editedFileinfo={id:null,imgUrl:null,thumbUrl:null};
    this.imageUploadComponent.deleteAll();
    this.thumbimgUpload.deleteAll();
}

imgVideoUpload(){
   this.imagevideoUpload.inputElement.nativeElement.click();
}

thumbImgUpload(){
   this.thumbimgUpload.inputElement.nativeElement.click();
}
  
public onthumbImgUploadFinished(file: FileHolder) {
      this.thumbfileInf = file;
      this.thumbnailUpload = true;
}

public onvideoImgUploadFinished(file: FileHolder) {
       this.imgfileInf = file;
       this.imageUploaded = true;
}
  
  public onthumbImgRemoved(file: FileHolder) {
      this.thumbnailUpload = false;
      this.thumbfileInf = null;
     
  }

public onvideoImgRemoved(file: FileHolder) {
     this.imageUploaded = false;
       this.imgfileInf = null;
}
  
setPagination(data)
  {
     this.pageData = data;
          this.dummdata  = this.pageData.slice(this.paginationConfig.pageIndex * this.paginationConfig.pageSize,
              (this.paginationConfig.pageIndex * this.paginationConfig.pageSize) + this.paginationConfig.pageSize);
                this.paginationConfig.pageLength = this.pageData.length;    
              
}

updateVideoInfo(id,value,flag)
  {
    let file =[];
    value.publishDate = (new Date().getTime())/1000;
    let key =  firebase.database().ref().push().key;
    if(flag){ 
    if(this.thumbfileInf)  
    file.push({file:this.thumbfileInf,key:key+'thumb'});
    if(this.imgfileInf)
    file.push({file:this.imgfileInf,key:key+'image'});
    this.uploadImgFiles(file).subscribe(res=>{
      value.thumbnailUrl = this.thumbfileInf ? res[0] && res[0].url ? res[0].url :'' :value.thumbnailUrl;
      value.fullImageUrl = this.imgfileInf ? this.thumbfileInf ? res[1] && res[1].url ? res[1].url :'' : res[0] && res[0].url ? res[0].url :'' :value.fullImageUrl;
       firebase.database().ref(`videoinfo/${id}`).set(value).then(
        (success) => {
         this.setFrom();
         this.getData().subscribe(res=>{
          this.setPagination(res.data);  
        })
        });
        })
    }
      else{
         firebase.database().ref(`videoinfo/${id}`).set(value).then(
        (success) => {
         this.setFrom();
         this.getData().subscribe(res=>{
          this.setPagination(res.data);  
         })
        });
    }
}


submitVideoInfo(value)
  {
    let file =[];
    value.publishDate = (new Date().getTime())/1000;
    let key =  firebase.database().ref().push().key;
    file.push({file:this.thumbfileInf,key:key+'thumb'});
    file.push({file:this.imgfileInf,key:key+'image'});
    this.uploadImgFiles(file).subscribe(res=>{
      value.thumbnailUrl = res[0] && res[0].url ? res[0].url :'';
      value.fullImageUrl = res[1] && res[1].url ? res[1].url :'';
      firebase.database().ref('videoinfo').push().set(value).then(
        (success) => {
         this.setFrom();
         this.getData().subscribe(res=>{
         this.setPagination(res.data); 
        })
        });
        })
}

uploadImgFiles(fileInformation):Observable<any>{
    let observableWatch = [];
    fileInformation.forEach(fileInfo => {
    observableWatch.push(this.uploadfleInfo(fileInfo.file,fileInfo.key));
    });
    return Observable.create(observer => { Observable.of(combineLatest(observableWatch).subscribe(res=>{
           // return res;
            observer.next(res);
    }))
    });
} 

getinfo(id): Observable<any>
  {
    let imgUrl=[];
    let formDataModel ={
      videoName :'',
      videoUrl :'',
      description:'',
      playListName : '',    
     };
     return  Observable.create(observer => {
      firebase.database().ref('videoinfo'+'/'+id).once('value').then(function(snapshot) {
       snapshot.forEach(function(child :any){
       if(formDataModel[child.key] != undefined)  
       formDataModel[child.key] = child.val();
       else if(child.key =='fullImageUrl'||child.key=='thumbnailUrl')
        imgUrl.push(child.val()); 
       })
        observer.next({"imgUrl":imgUrl,"formdata":formDataModel});
      // formData.setValue(formDataModel);
     })
     });
}


uploadfleInfo(upload,key,prefix?): Observable<any>{
        let imgUrl;
        const storageRef = fbstorage.storage().ref();
        const uploadTask = storageRef.child(`${key+upload.file.name}`).put(upload.file);
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



getData(): Observable<any>
    {
     let videoArray = [];
     let vData = {'id':''}; 
     return  Observable.create(observer => {
     firebase.database().ref('videoinfo').once('value').then(function(snapshot) {
     snapshot.forEach(function(child :any){
     vData = {id:''};  
     vData = child.val();
     vData.id = child.key;
     videoArray.push(vData);
     videoArray =videoArray.reverse();
     });
     }).then(success=>{
         observer.next({"success":true,"data":videoArray});
     }, error=>{
         observer.next({"success":false});
     })
     });
    }

}
