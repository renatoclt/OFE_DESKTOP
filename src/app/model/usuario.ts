export class Usuario {
    id: string;
    nombreusuario: string;
    nombrecompleto: string;   
    perfil:string;
    url_image:string;
    org_url_image?:string;
    token:string;
    ruc_org?:string;
    isopais_org?: string;

    org_id:string;
    tipo_empresa:string;
    organizaciones?: Organizacion[];
    avatar_blob?:any;
}


export class Organizacion {
    id: string;
    nombre: string;
    tipo_empresa: string;
    keySuscripcion:string;
    ruc:string;
    url_image?:string;
    isoPais?:string;
}