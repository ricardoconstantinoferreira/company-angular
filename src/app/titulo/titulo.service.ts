import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Titulo } from "./titulo";

@Injectable({
    providedIn: 'root'
})
export class TituloService {

    constructor(private http: HttpClient) {}

    search() {
        let uri = "api/title";
        return this.http.get<Titulo[]>(uri);
    }

    searchTitleById(id: string) {
        let uri = `api/title/${id}`;
        return this.http.get<Titulo>(uri);
    }

    save(descricao: string, perguntas: any) {
        let uri = "api/title";
        const options = { headers: { 'Content-Type': 'application/json' } };
        let data = {
            descricao: descricao,
            perguntas: perguntas
        };

        return this.http.post(uri, JSON.stringify(data), options);
    }
}