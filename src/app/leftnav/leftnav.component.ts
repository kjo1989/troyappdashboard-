import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {
  currentRoute = '';
  constructor(private route: ActivatedRoute,private router: Router) {  
    this.currentRoute = 'fileupload';
  }

  ngOnInit() {
   }
  
  navigatetoPage(page)
  {
    switch(page)
    {
      case 'fileupload': this.router.navigate(['fileupload']); this.currentRoute = 'fileupload' ;
      break;
      case 'videoUpload': this.router.navigate(['videoupload']); this.currentRoute = 'videoUpload' ;
      break;
      case 'messages': this.router.navigate(['messages']); this.currentRoute = 'messages' ;
      break;
      default:this.router.navigate(['fileupload']); this.currentRoute = 'fileupload' ;
      break;
    }
  }
}
