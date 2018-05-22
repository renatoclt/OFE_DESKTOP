export class persona {
    private id: number;
    private idDocumento: number;
    private tipoDocumento: number;
    private documento: string;
    private denominacion: string;
    private nombreComercial: string;
    private nombre: string;
    private apellidoPaterno: string;
    private apellidoMaterno: string;
    private direccion: string;
    private correo: string;
    private usuarioCreacion: string;
    private usuarioModifica: string;
    private fechaCreacion: Date;
    private fechaModificacion: Date;
    private estado: number;
    private fechaSincronizacion: Date;
    private estadoSincronizado: number;

    public setId(id: number) {
        this.id = id;
    }
    public getId(): number {
        return this.id;
    }

    public setIdDocumento(idDocumento: number) {
        this.idDocumento = idDocumento;
    }
    public getIdDocumento(): number {
        return this.idDocumento;
    }

    public setTipoDocumento(tipoDocumento : number) {
        this.tipoDocumento = tipoDocumento;
    }
    public getTipoDocumento() : number {
        return this.tipoDocumento;
    }

    public setDocumento(documento: string) {
        this.documento = documento;
    }
    public getDocumento(): string {
        return this.documento;
    }

    public setDenominacion(denominacion: string) {
        this.denominacion = denominacion;
    }
    public getDenominacion(): string {
        return this.denominacion;
    }

    public setNombreComercial(nombreComercial: string) {
        this.nombreComercial = nombreComercial;
    }
    public getNombreComercial(): string {
        return this.nombreComercial;
    }

    public setNombre(nombre: string) {
        this.nombre = nombre;
    }
    public getNombre(): string {
        return this.nombre;
    }

    public setApellidoPaterno(apellidoPaterno: string) {
        this.apellidoPaterno = apellidoPaterno;
    }
    public getApellidoPaterno(): string {
        return this.apellidoPaterno;
    }

    public setApellidoMaterno(apellidoMaterno: string) {
        this.apellidoMaterno = apellidoMaterno;
    }
    public getApellidoMaterno(): string {
        return this.apellidoMaterno;
    }

    public setDireccion(direccion: string) {
        this.direccion = direccion;
    }
    public getDireccion(): string {
        return this.direccion;
    }

    public setCorreo(correo: string) {
        this.correo = correo;
    }
    public getCorreo(): string {
        return this.correo;
    }

    public setUsuarioCreacion(usuarioCreacion: string) {
        this.usuarioCreacion = usuarioCreacion;
    }
    public getUsuarioCreacion(): string {
        return this.usuarioCreacion;
    }

    public setUsuarioModifica(usuarioModifica: string) {
        this.usuarioModifica = usuarioModifica;
    }
    public getUsuarioModifica(): string {
        return this.usuarioModifica;
    }

    public setFechaCreacion(fechaCreacion: Date) {
        this.fechaCreacion = fechaCreacion;
    }
    public getFechaCreacion(): Date {
        return this.fechaCreacion;
    }

    public setFechaModificacion(fechaModificacion: Date) {
        this.fechaModificacion = fechaModificacion;
    }
    public getFechaModificacion(): Date {
        return this.fechaModificacion;
    }

    public setEstado(estado: number) {
        this.estado = estado;
    }
    public getEstado(): number {
        return this.estado;
    }

    public setFechaSincronizacion(fechaSincronizacion: Date) {
        this.fechaSincronizacion = fechaSincronizacion;
    }
    public getFechaSincronizacion(): Date {
        return this.fechaSincronizacion;
    }

    public setEstadoSincronizado(estadoSincronizado: number) {
        this.estadoSincronizado = estadoSincronizado;
    }
    public getEstadoSincronizado(): number {
        return this.estadoSincronizado;
    }

    constructor() {
        this.id = 0;
        this.idDocumento = 0;
        this.tipoDocumento = 0;
        this.documento = null;
        this.denominacion = null;
        this.nombreComercial = null;
        this.nombre = null;
        this.apellidoPaterno = null;
        this.apellidoMaterno = null;
        this.direccion = null;
        this.correo = null;
        this.usuarioCreacion = null;
        this.usuarioModifica = null;
        this.fechaCreacion = null;
        this.fechaModificacion = null;
        this.estado = 0;
        this.fechaSincronizacion = null;
        this.estadoSincronizado = 0;
    }
}