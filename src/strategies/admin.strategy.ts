import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AutenticacionService} from '../services';
const jwt = require("jsonwebtoken");


export class EstrategiaAdministrador implements AuthenticationStrategy{
  name: string = 'admin';

  constructor(
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) {
  }

  async authenticate(request: Request): Promise<UserProfile | undefined>{
    let token = parseBearerToken(request);
    if (token) {
      let datos = this.servicioAutenticacion.ValidarTokenJWT(token);
      if (datos) {
        let perfil: UserProfile = Object.assign({
          nombre: datos.data.nombres
        });
        return perfil;
        ///if (datos.data.roles) en caso que queramos poner los rol del usuario

      } else {
        throw new HttpErrors [401]("el token incluido no es valido")
      }
    } else {
      throw new HttpErrors [401]("no se ha incluido el token en la solicitud")
    }

  }

}
