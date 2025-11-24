import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

interface CalendarEvent {
  date: string; // format 'YYYY-MM-DD'
  title: string;
  color?: string;
  description?: string;
}

interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-a',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  constructor(private menuCtrl: MenuController) {}

  // ====== LOGIQUE AGENDA ======

  currentDate = new Date();
  currentMonth!: number;
  currentYear!: number;

  days: CalendarDay[] = [];
  weekdayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Mock d’événements — tu pourras les remplacer par des données réelles
  events: CalendarEvent[] = [
    { date: '2025-11-21', title: 'Réunion équipe', color: '#3b82f6', description: 'Réunion hebdo avec le staff.' },
    { date: '2025-11-23', title: 'Culte spécial', color: '#10b981', description: 'Culte avec invités.' },
    { date: '2025-11-23', title: 'Répétition chorale', color: '#f59e0b', description: 'Préparation louange.' },
    { date: '2025-11-25', title: 'Visite missionnaire', color: '#ec4899', description: 'Rencontre avec les missionnaires.' },
  ];

  // ====== ÉTAT DU MODAL (bottom sheet) ======
  selectedDay: CalendarDay | null = null;
  isDayModalOpen = false;

  ngOnInit() {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
  }

  get monthLabel(): string {
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(new Date(this.currentYear, this.currentMonth, 1));
  }

  get selectedDayLabel(): string {
    if (!this.selectedDay) return '';
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(this.selectedDay.date);
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  private generateCalendar() {
    this.days = [];

    const firstOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const jsDay = firstOfMonth.getDay();
    const offset = (jsDay + 6) % 7; // Lundi = 0

    const startDate = new Date(firstOfMonth);
    startDate.setDate(firstOfMonth.getDate() - offset);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const inCurrentMonth = date.getMonth() === this.currentMonth;
      const isToday = this.isSameDate(date, new Date());
      const events = this.getEventsForDate(date);

      this.days.push({ date, inCurrentMonth, isToday, events });
    }
  }

  private getEventsForDate(date: Date): CalendarEvent[] {
    const key = this.toKey(date);
    return this.events.filter((e) => e.date === key);
  }

  private toKey(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private isSameDate(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  // ====== GESTION DU BOTTOM SHEET ======

  openDayDetails(day: CalendarDay) {
    if (!day.events || day.events.length === 0) {
      // Si tu veux ouvrir quand même même sans événements, supprime ce return
      return;
    }
    this.selectedDay = day;
    this.isDayModalOpen = true;
  }

  closeDayDetails() {
    this.isDayModalOpen = false;
  }

  // ====== MENU BURGER ======

  async logAndToggle(ev?: Event) {
    try {
      await this.menuCtrl.enable(true, 'main-menu');
      const res = await this.menuCtrl.toggle('main-menu');
    } catch (err) {
      console.error('[Accueil] menu toggle error:', err);
    }
  }

}
