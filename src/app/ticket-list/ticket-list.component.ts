import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TicketFormComponent],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class TicketListComponent implements OnInit {
  tickets: any[] = [];
  filteredTickets: any[] = [];

  filters = {
    active: true,
    inactive: true,
    disponible: true,
    agotado: true,
    preventa: true
  };

  showFilters = false;
  showModal = false;
  showAddForm = false;
  selectedTicket: any = null;

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.loadFiltersFromStorage();
    this.loadTickets();
  }

  loadFiltersFromStorage(): void {
    const savedFilters = localStorage.getItem('ticketFilters');
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
    }
  }

  saveFiltersToStorage(): void {
    localStorage.setItem('ticketFilters', JSON.stringify(this.filters));
  }

  loadTickets(): void {
    this.ticketService.getAllTickets().subscribe(
      (response) => {
        this.tickets = response.data;
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching tickets', error);
      }
    );
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket =>
      ((this.filters.active && ticket.attributes.active) ||
       (this.filters.inactive && !ticket.attributes.active)) &&
      ((this.filters.disponible && ticket.attributes.status === 'Disponible') ||
       (this.filters.agotado && ticket.attributes.status === 'Agotado') ||
       (this.filters.preventa && ticket.attributes.status === 'Preventa'))
    );
    this.saveFiltersToStorage();
  }

  onTicketCreated(): void {
    this.loadTickets();
    this.showAddForm = false;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  openModal(ticket: any): void {
    this.selectedTicket = ticket;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTicket = null;
  }

  toggleTicketActive(id: string, currentActive: boolean): void {
    this.ticketService.toggleTicketActive(id, !currentActive).subscribe(
      () => {
        this.loadTickets();
        this.closeModal();
      },
      (error) => {
        console.error('Error toggling ticket active status', error);
      }
    );
  }

  updateTicketStatus(id: string, newStatus: string): void {
    this.ticketService.updateTicketStatus(id, newStatus).subscribe(
      () => {
        this.loadTickets();
        this.closeModal();
      },
      (error) => {
        console.error('Error updating ticket status', error);
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Disponible': return 'bg-green-500 text-white';
      case 'Agotado': return 'bg-red-500 text-white';
      case 'Preventa': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  }

  deleteTicket(id: string): void {
    if (confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      this.ticketService.deleteTicket(id).subscribe(
        () => {
          this.loadTickets();
        },
        (error) => {
          console.error('Error deleting ticket', error);
        }
      );
    }
  }
}
