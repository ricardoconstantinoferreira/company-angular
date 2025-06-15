import { Funcionario } from "../funcionario/funcionario";
import { Pergunta } from "./pergunta";

export class Resposta {
    id?: string;
    description?: string;
    funcionario?: Funcionario;
    pergunta?: Pergunta;
}