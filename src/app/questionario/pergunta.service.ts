import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PerguntaService {

    constructor(private http: HttpClient) {}

    save(pergunta: any) {
        let uri = "api/question";
        const options = { headers: { 'Content-Type': 'application/json' } };
        let data = {
            pergunta: pergunta
        };

        return this.http.post<any>(uri, JSON.stringify(data), options);
    }
        
}