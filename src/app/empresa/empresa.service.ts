import { Injectable } from "@angular/core";
import { Empresa } from "./empresa";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
    constructor(private http: HttpClient) {}

    search(): Observable<Empresa[]> {
      const uri = "api/company"
      return this.http.get<Empresa[]>(uri);
    }

    save(empresa: Empresa, updated: boolean): Observable<any> {
      let uri = "api/company"
      const options = { headers: { 'Content-Type': 'application/json' } };
      let data = {
        razao_social: empresa.razao_social,
        nome_fantasia: empresa.nome_fantasia,
        cnpj: empresa.cnpj      
      };

      if (!updated) {
        return this.http.post(uri, JSON.stringify(data), options);
      } else {
        uri += "/" + empresa.id;
        return this.http.put(uri, JSON.stringify(data), options);
      }
    }

    findById(id: string): Observable<Empresa> {   
      const uri = "api/company/" + id;   
      return this.http.get<Empresa>(uri);
    }

    delete(id: string): Observable<Empresa> {
      const uri = `api/company/${id}`;
      const options = { 
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
      };
      return this.http.delete<Empresa>(uri, options);
    }
}