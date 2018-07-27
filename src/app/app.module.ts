import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageUploadModule } from 'angular2-image-upload';
import { AppRoutingModule } from './app.routing';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule,MatPaginatorModule,MatProgressSpinnerModule,MatSnackBarModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent} from './pages/login.component';
import { LeftnavComponent } from './leftnav/leftnav.component';
import { FileuploadComponent } from './pages/fileupload.component';
import { MessagesComponent } from './pages/messages.component';
import { VideoUploadComponent } from './pages/videoupload.component';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { AuthGuard } from './authguard/auth.guard';
import { SimpleLayoutComponent } from './layout/simple-layout.component'
import { FullLayoutComponent } from './layout/full-layout.component';
import { PopoverModule } from 'ng2-popover';
@NgModule({
  declarations: [
    AppComponent,HeaderComponent,
    LeftnavComponent,FileuploadComponent,
    MessagesComponent,VideoUploadComponent,
    LoginComponent,SimpleLayoutComponent,FullLayoutComponent
  ],
  imports: [
    BrowserModule,ReactiveFormsModule,BrowserAnimationsModule,AppRoutingModule,
    FormsModule,MatTableModule,MatPaginatorModule,MatProgressSpinnerModule,MatSnackBarModule,
    ImageUploadModule.forRoot(),AngularFireDatabaseModule, AngularFireAuthModule,
    HttpClientModule,HttpModule,PopoverModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(firemodule:AngularFireModule){
    firebase.initializeApp(environment.firebaseConfig);
               
  }
 }
