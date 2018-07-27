import { Component,OnInit } from '@angular/core';

@Component({
  template: `
<div class="main">  
<div class="row">
<app-leftnav class="col-lg-2 col-md-2 col-sm-2 d-none d-sm-block nomargin"></app-leftnav>
<div class="col-lg col-sm-10">
<app-header></app-header>
<router-outlet></router-outlet>
</div>
</div>
</div>
  `,
  styles :[`.row, .nomargin{
    margin: 0px !important;
    padding: 0px !important;
}
.main{
 background-image: linear-gradient(rgb(4, 26, 37),rgb(4, 26, 37));
    min-height: 100vh;
}`]
})
export class FullLayoutComponent implements OnInit {
  constructor(){

  }
  
  ngOnInit() {
    
   }
  
}
