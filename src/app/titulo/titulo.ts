import { Pergunta } from "../questionario/pergunta";

export class Titulo {
    id?: string;
    descricao?: string;
    pergunta?: Pergunta[] = [];
}