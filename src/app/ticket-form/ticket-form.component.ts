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

  errorMessage: string = '';

  constructor(private ticketService: TicketService) { }

  onSubmit(): void {
    this.errorMessage = '';
    this.ticketService.isTitleUnique(this.ticket.title).subscribe(
      isUnique => {
        if (isUnique) {
          this.createTicket();
        } else {
          this.errorMessage = 'A ticket with this title already exists. Please choose a different title.';
        }
      },
      error => {
        console.error('Error checking title uniqueness:', error);
        this.errorMessage = 'An error occurred while creating the ticket. Please try again.';
      }
    );
  }

  private createTicket(): void {
    this.ticketService.createTicket(this.ticket).subscribe(
      (response) => {
        console.log('Ticket created', response);
        this.resetTicket();
        this.ticketCreated.emit();
      },
      (error) => {
        console.error('Error creating ticket', error);
        this.errorMessage = 'An error occurred while creating the ticket. Please try again.';
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
    this.errorMessage = '';
  }
}
