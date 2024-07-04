import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://essential-vacation-6ff9a7193e.strapiapp.com/api/prueba-tecnica-tickets';
  private token = '11162822dc1fa78fc809bb1d9cfaad5ba07f8019dc9e6ce36fe05c350086091367d5a16f852442e6b86dc264c8dd79b677d4e60b5968629385bcd875b33f4c4b472a2d533ede15b2b63e87fa7dfa0c7e0bf78ed6d5d0df87622e29538fdee630331e594e45d7c6b7a637d9ac92e8a8e6e32e85bc2964c83a53bebdddd4a6fdd4';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  getAllTickets(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  createTicket(ticket: any): Observable<any> {
    const ticketData = {
      data: {
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        active: true,
        archived: false
      }
    };
    return this.http.post(this.apiUrl, ticketData, { headers: this.getHeaders() });
  }

  updateTicketStatus(id: string, status: string): Observable<any> {
    const ticketData = {
      data: {
        status: status
      }
    };
    return this.http.put(`${this.apiUrl}/${id}`, ticketData, { headers: this.getHeaders() });
  }

  toggleTicketActive(id: string, isActive: boolean): Observable<any> {
    const ticketData = {
      data: {
        active: isActive
      }
    };
    return this.http.put(`${this.apiUrl}/${id}`, ticketData, { headers: this.getHeaders() });
  }
  deleteTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
