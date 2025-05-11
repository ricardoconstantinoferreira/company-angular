import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Funcionario } from "./funcionario";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FuncionarioService {

    constructor(private http: HttpClient) {}

    search() {
        let uri = "api/employee";
        return this.http.get<Funcionario[]>(uri);
    }

    searchByEmpresaId(id: string) {
        let uri = `api/employee/company/${id}`;
        return this.http.get<Funcionario[]>(uri);
    }

    save(funcionario: Funcionario, updated: boolean): Observable<any> {
        let uri = "api/employee"
        const options = { headers: { 'Content-Type': 'application/json' } };
        let data = {
            name: funcionario.name,
            cargo: funcionario.cargo,
            empresa_id: funcionario.empresa_id      
        };

        if (!updated) {
            return this.http.post(uri, JSON.stringify(data), options);
        } else {
            uri += "/" + funcionario.id;
            return this.http.put(uri, JSON.stringify(data), options);
        }
    }

    findById(id: string): Observable<Funcionario> {
        const uri = `api/employee/${id}`;
        return this.http.get<Funcionario>(uri);
    }

    delete(id: string): Observable<Funcionario> {
        const uri = `api/employee/${id}`;
        const options = {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        };

        return this.http.delete<Funcionario>(uri, options);
    }
}