import {Injectable} from '@angular/core';
import {BASE_URL} from 'app/utils/app.constants';

@Injectable()
export class Servidores {
    public server1 = BASE_URL +'fe';
    public server2 = BASE_URL +'fe';
    public server6 = BASE_URL +'fe';
    public server3 = BASE_URL +'fe';
    // public server4 = 'http://192.168.70.26';
    public server4 = BASE_URL +'fe';
    public server5 = BASE_URL +'fe';

    // **** SERVER 1 **** //
    public AFEDOCUQRY = this.server5 + '/ms-parametro-query/v1';
    public PARMQRY    = this.server5 + '/ms-parametro-query/v1';


    // **** SERVER 2 **** //
    public NOTIFIC    = this.server2 + '/ms-notificaciones/v1';

    // **** SERVER 3 **** //
    public FILEQRY    = this.server3 + '/ms-archivos-query/v1';

    // **** SERVER 4 **** //
    public DOCUQRY    = this.server2 + '/ms-documentos-query/v1';
    public DOCUCMD    = this.server4 + '/ms-documentos-command/v1';

    // **** SERVER 5 **** //
    public ORGAQRY    = this.server5 + '/ms-organizaciones-command/v1';
    public ORGACMD    = this.server5 + '/ms-organizaciones-query/v1';
    public INVEQRY    = this.server1 + '/ms-inveqry/v1';
    public INVECMD    = this.server2 + '/ms-inventarios-command/v1';

}