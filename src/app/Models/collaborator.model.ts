import { EstadoRecruiting } from "./estadoRecruiting.model"
import { ManagementArea } from "./managementArea.model"
import { NivelNeoris } from "./nivelNeoris.model"
import { PlataformaBBVA } from "./plataformaBBVA.model"
import { TrackPosition } from "./trackPosition.model"

export class Collaborator {
    id?: Number
    nombres: String
    apellidos: String
    codigoEmpleado: String
    codigoXp: String
    pais: String
    dni: String
    estadoNeoris: String
    fechaNacimiento: String
    celular: String
    fechaIngresoNeoris: String
    fechaSalidaNeoris?: String
    correoNeoris: String
    estadoPmoBbva: String
    correoContractor: String
    fechaAltaContractor: String
    vdiPmo: String
    fechaAltaVDI: String
    accesoServiceNow: String
    fechaAltaAccesoServiceNow: String
    timeReport: String
    accesoRacf: String
    fechaAccesoRacf: String
    ipVdiPmo: String
    imagen?: String
   /* trackPosition: Number  
    managementArea: Number
    nivelNeoris: Number
    plataformaBBVA: Number
    estadoRecruiting: Number*/
    trackPosition: TrackPosition  
    managementArea: ManagementArea
    nivelNeoris: NivelNeoris
    plataformaBBVA: PlataformaBBVA
    estadoRecruiting: EstadoRecruiting 
    especialidades?: []
    proyectosNeoris?: []
    dataBBBVA?: [] 
    perfilBBVA?: [] 
}