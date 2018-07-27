import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {
res : boolean;
  constructor(
    private router: Router,
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.checkToken()) {
            
          return true;
    }
         this.router.navigate(["/auth"]);
         return false;

       }

    checkToken()
    {
     let token = localStorage.getItem("troypoint");
     let tokenData= token && token.length >0 ? JSON.parse(token): null;
     return tokenData && tokenData.userId && tokenData.userId.length > 0 ? true : false;
    }   
}
