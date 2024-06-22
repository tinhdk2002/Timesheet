import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const appGuard: CanActivateFn = (route, state) => {
  const jwtHelper = new JwtHelperService();
  const token = localStorage.getItem('token');

  if(token && !jwtHelper.isTokenExpired(token))
    return true;
  return inject(Router).createUrlTree(['/login']);
};
