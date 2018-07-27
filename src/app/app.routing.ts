import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileuploadComponent } from './pages/fileupload.component';
import { MessagesComponent } from './pages/messages.component';
import { VideoUploadComponent } from './pages/videoupload.component';
import { LoginComponent} from './pages/login.component';
import { AuthGuard } from './authguard/auth.guard';
import {FullLayoutComponent} from './layout/full-layout.component';
import {SimpleLayoutComponent} from './layout/simple-layout.component';

const appRoutes: Routes = [
     {
      path: '', component: SimpleLayoutComponent, children: [
      { path: '', component:LoginComponent },
      { path: 'auth', component:LoginComponent },
      ]
     },
    {
         path: '', canActivate: [AuthGuard], component: FullLayoutComponent, children: [
            { path: 'fileupload', component: FileuploadComponent, data: { name: 'file' } },
            { path:'messages',    component: MessagesComponent, data: { name: 'meg' }},
            { path:'videoupload', component: VideoUploadComponent, data: { name: 'video' }}
         ]
    }
    // { path: '', component: LoginComponent, data: { name: 'login' } },
    // { path: 'auth', component: LoginComponent, data: { name: 'login' } },
    // { path: 'fileupload', canActivate: [AuthGuard], component: FileuploadComponent, data: { name: 'file' } },
    // { path:'messages', canActivate: [AuthGuard], component: MessagesComponent, data: { name: 'meg' }},
    // { path:'videoupload', canActivate: [AuthGuard], component: VideoUploadComponent, data: { name: 'video' }}



    ];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
