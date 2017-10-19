import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import{Router} from '@angular/router'
import { AdminService } from '../../services/admin.service';
import { PublicarService } from '../../services/publicar.service';
import { Subscription } from 'rxjs/Rx';
import { CONFIGPROD } from '../../services/config/config.constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  registro:boolean=false;
  selectPais:any;
  listaPais:any[]=[];
  rEmail:any;
  rPass:any;
  rCorreo:any;
  /* subForm: Subscription; */
  private url: string = CONFIGPROD.url;
  constructor(
    private service: AdminService,
    private router:Router,
    private _publicarService:PublicarService
  ) { }
  misdatosdataconfig: any = {
        'activemodal': false,
        'titulo': 'Mensaje de Easymaq',
        'descripcion': 'En unos momentos le estaremos informando a su correo'

  };

  misdatosdataconfig2: any = {
        'activemodal': false,
        'titulo': 'Mensaje de Easymaq',
        'descripcion': 'En unos momentos le estaremos informando a su correo'

  };
  ngOnInit() {
    this.getPais();
  }

  showBtnmodal(event) {
    this.misdatosdataconfig2.activemodal = event.nameBtnmodal;
    this.submit(this.rEmail,this.rPass,this.rCorreo);
    // this.submit()
  }

  ngOnDestroy(): void {
    /* this.subForm.unsubscribe(); */
  }
  confirm(des:string){
    this.misdatosdataconfig.activemodal=true;
    this.misdatosdataconfig.descripcion=des;
  }

  confirmRegistro(text:string){
    this.misdatosdataconfig2.activemodal=true;
    this.misdatosdataconfig2.descripcion=text;
  }

  getPais(){
    let pais = this._publicarService.getPais()
            .subscribe(res=>{
                this.listaPais=res;
                console.log(this.listaPais)
                pais.unsubscribe();
            })
  }


  submit(name,pass,correo){
    let obj = {
      email: name,
      password: pass
    }
    console.log(name+'-'+pass)
    if(name == "" || pass == ""){
        this.confirm('Asegurese haber llenado los campos');
    }else if(!correo.valid){
        this.confirm('Error en el formato de correo');
    }else{
      let subForm: Subscription = this.service.login(`${this.url}/usuarios/login?include=user`, obj)
        .subscribe((res: any) => {
          console.log('res: ', res);
          this.service.set(res);
        }, (err: any) => {
          console.log('err : ', err);
          this.confirm("Correo o contraseña ingresados son incorrectos")
        }, () => {
          console.log('complete');
          subForm.unsubscribe();
          this.router.navigate(['/home']);
        });
    }

  }

  // register(email: string, pass: string, pru: any, emp: string,pais:string) {
  //   if (!email || !pass) {
  //     return;
  //   } else {
  //     let subForm: Subscription = this.service.register({
  //       email: email,
  //       password: pass,
  //       empresa: emp,
  //       countryId: pais
  //     }).subscribe((res: any) => {
  //       console.log('res: ', res);
  //       this.rEmail = email;
  //       this.rPass = pass;
  //       this.rCorreo = pru;
  //       this.confirmRegistro('Cuenta creada exitosamente, te enviamos un correo de bienvenida.');

  //     },(err:any)=>{
  //       this.confirm('El correo ingresado ya se encuentra registrado.');
  //     });
  //   }
  //   console.log(emp,pais,email,pass)
  // }

  register(email: string, pass: string, pru: any, emp: string,pais:string) {
    if (!email || !pass) {
      return;
    } else {
      let subForm: Subscription = this.service.register({
        email: email,
        password: pass,
        empresa: emp,
        countryId: pais
      }).subscribe((res: any) => {
        console.log('res: ', res);
        this.rEmail = email;
        this.rPass = pass;
        this.rCorreo = pru;
        this.confirmRegistro('Cuenta creada exitosamente, te enviamos un correo de bienvenida.');

      },(err:any)=>{
        // console.log('res: ', res);
        if(err==2){
         this.confirm('El correo ingresado ya se encuentra registrado como cuenta empresarial.');
        }else{
            if(!emp || !pais){
              this.confirm('El correo ingresado ya existe, complete todos los campos para obtener su cuenta empresarial.')
            }
            else{

              let id = this.service.getIdxEmail({
                email:email
              }).subscribe(res=>{
                console.log(res.id)
                  let subFormChangeC :Subscription= this.service.registerChangeWxE({
                  password:pass,
                  empresa:emp,
                  countryId:pais
                },res.id).subscribe((res:any)=>{
                  console.log(res)
                  this.rEmail = email;
                  this.rPass = pass;
                  this.rCorreo = pru;
                  console.log(this.rEmail,this.rPass,this.rCorreo)
                  this.confirmRegistro('Cuenta creada exitosamente, te enviamos un correo de bienvenida.');
                })
              })

            }
        }
      });
    }
    // console.log(emp,pais,email,pass)
  }
  changeContainer(){
    this.registro=!this.registro;
  }

}
