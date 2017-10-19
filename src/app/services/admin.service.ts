import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './http-client.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { CONFIGPROD } from './config/config.constant';


@Injectable()
export class AdminService {
  private url: string = CONFIGPROD.url;
  constructor(
    private http: HttpClient
  ) { }

  login(ruta: string, obj: any): Observable<any> {
    let data = JSON.stringify(obj);
    return this.http.post(ruta, data)
      .map((res: Response) => {
        const data1 = res.json();
        return data1;
      }).catch((err: Response | any) => {
        console.log('err : ', err);
        let errmsg: string;
        if (err instanceof Response) {
          errmsg = 'Email o contraseña incorrectos';
        }
        return Observable.throw(errmsg);
      });
  }

  loggedIn(): boolean {
    if (localStorage.getItem('client')) {
      return true;
    } else {
      return false;
    }
  }


   set(obj: any): void {
      localStorage.setItem('client', JSON.stringify(obj));
  }

  register(obj?: any): Observable<any> {
    let query: string = `${this.url}/usuarios`;
    let data = JSON.stringify({
      email: obj.email,
      password: obj.password,
      empresa: obj.empresa,
      countryId: obj.countryId
    });
    return this.http.post(query, data)
      .map((res: Response) => {
        const data = res.json();
        return data;
      }).catch((err: Response | any) => {
        console.log('err : ', err);
        let errmsg: string;
        if (err instanceof Response) {
          errmsg = err.json() && err.json().msg || 'Tenemos problemas en el servidor.\nIntentelo más tarde';
        }
        return Observable.throw(errmsg);
      });
  }
  getIdxEmail(obj:any){
    let ruta = `${this.url}/usuario-id`;
    let data = JSON.stringify(obj);
        return this.http.post(ruta, data)
            .map(res => {
                const data1 = res.json();
                return data1;
            })

  }

  registerChangeWxE(obj:any, idusuario:string):Observable<any>{
     let query: string = `${this.url}/usuario-upgrade/${idusuario}`;
      let data = JSON.stringify({
      // email: obj.email,
      password: obj.password,
      empresa: obj.empresa,
      countryId: obj.countryId
    });
    return this.http.put(query, data)
      .map((res: Response) => {
        const data = res.json();
        return data;
      }).catch((err: Response | any) => {
        // console.log('err : ', err);
        let errmsg: string;
        if (err instanceof Response) {
          errmsg = err.json() && err.json().msg || 'Tenemos problemas en el servidor.\nIntentelo más tarde';
        }
        return Observable.throw(errmsg);
      });
  }

}
