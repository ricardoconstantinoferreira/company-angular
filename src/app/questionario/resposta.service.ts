import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Questionario } from "./questionario";
import { Resposta } from "./resposta";

@Injectable({
    providedIn: 'root'
})
export class RespostaService {

    constructor(private http: HttpClient) {}

    save(questionario: Questionario) {
        let uri = "api/answer";
        const options = { headers: { 'Content-Type': 'application/json' } };
        let data = {
            perguntas: questionario.pergunta,
            funcionario_id: questionario.funcionario_id
        };

        return this.http.post(uri, JSON.stringify(data), options);
    }

    getAnswerWithQuestionDescription(perguntaId: string, funcionarioId: string) {
        let uri = `api/answer/answer-by-question-id/${perguntaId}/${funcionarioId}`;
        return this.http.get<Resposta>(uri);
    }
}