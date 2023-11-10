import internal from "assert"
import { PeticionDetalle } from "./peticionDetalle.model"

export class PeticionDetalleCabecera {
    idPeticion: Number;
    codigoProyecto: Number
    tipoTarea: Number
    periodo: Number
    numero: String
    nombre: String
    idUsuario: Number
    usuarioCreacion : String
    usuarioModificacion : String
    peticionDetalle: PeticionDetalle[]
}