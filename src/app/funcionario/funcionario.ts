import { Empresa } from "../empresa/empresa";

export class Funcionario {
    id?: string;
    name?: string;
    cargo?: string;
    empresa_id?: string;
    empresa?: Empresa;
}