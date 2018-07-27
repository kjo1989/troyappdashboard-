import { Component } from '@angular/core';

@Component({
  template: `
         <div class="main">  
         <div class="col-lg-12 row" style="height:60px;">
          <div class="col-lg-2 logo"></div>
          <div class="col-lg-10 header">
          <h6>TROYPOINT APP DASHBOARD</h6>
          </div></div>
         <router-outlet> </router-outlet> </div>   
    `,
  styles : [`.row, .nomargin{
    margin: 0px !important;
    padding: 0px !important;
}
.header{
    color: white;
    vertical-align: middle;
    margin-top: 15px;
}  
.main{
 background-image: linear-gradient(rgb(4, 26, 37),rgb(4, 26, 37));
    min-height: 100vh;
 }   
.logo{
     background-image: url("../.././assets/images/logo.png");
     background-repeat-y: no-repeat;
}
`],
 })
export class SimpleLayoutComponent {

}