import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent {
  @Output() ticketCreated = new EventEmitter<void>();

  ticket = {
    title: '',
    description: '',
    status: 'Agotado',
    active: false
  };

  constructor(private ticketService: TicketService) { }

  onSubmit(): void {
    this.ticketService.createTicket(this.ticket).subscribe(
      (response) => {
        console.log('Ticket created', response);
        this.resetTicket();
        this.ticketCreated.emit();  // Emitir evento
      },
      (error) => {
        console.error('Error creating ticket', error);
      }
    );
  }

  resetTicket(): void {
    this.ticket = {
      title: '',
      description: '',
      status: 'Agotado',
      active: false
    };
  }
}
