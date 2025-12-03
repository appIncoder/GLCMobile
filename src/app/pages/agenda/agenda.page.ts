import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonImg,
} from '@ionic/angular/standalone';
import { Gesture, GestureController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface CalendarEvent {
  title: string;
  description?: string;
  color?: string;
  date: Date;
  time?: string;      // ⬅️ nouvel attribut
  imageUrl?: string;  // ⬅️ nouvel attribut
}

interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

/**
 * Structure attendue depuis l'API /api/agenda
 * (à adapter en fonction de ton backend réel)
 *
 * Exemple de payload pour un élément :
 * {
 *   "title": "Célébration du dimanche",
 *   "date": "2025-12-16",
 *   "time": "10:00",
 *   "image_url": "https://glcbaudour.be/images/mon-image.jpg",
 *   "description": "..."
 * }
 */
interface AgendaApiItem {
  title: string;
  description?: string;
  color?: string;
  date: string;      // ISO string ou 'YYYY-MM-DD'
  time?: string;     // ⬅️ récupéré depuis le backend
  image_url?: string; // ⬅️ récupéré depuis le backend
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonList,
    IonItem,
    IonImg,
    HttpClientModule, // ⬅️ nécessaire pour les appels HTTP dans ce composant
  ],
})
export class AgendaPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendarWrapper', { read: ElementRef })
  calendarWrapper!: ElementRef;

  private calendarGesture?: Gesture;

  currentDate: Date = new Date();
  monthLabel = '';
  weekdayNames: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  days: CalendarDay[] = [];

  isDayModalOpen = false;
  selectedDay: CalendarDay | null = null;
  selectedDayLabel = '';

  swipeDirection: 'left' | 'right' | null = null;

  // 🔹 événements venant du backend
  private events: CalendarEvent[] = [];

  isLoadingEvents = false;
  loadError?: string;

  constructor(
    private gestureCtrl: GestureController,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.updateMonthLabel();
    // On affiche déjà un calendrier vide
    this.generateCalendarDays();
    // Puis on charge les événements depuis l’API
    this.loadEventsFromBackend();
  }

  ngAfterViewInit(): void {
    const el = this.calendarWrapper?.nativeElement;
    if (!el) {
      console.warn('calendarWrapper non trouvé');
      return;
    }

    this.calendarGesture = this.gestureCtrl.create(
      {
        el,
        gestureName: 'calendar-swipe',
        direction: 'x',
        threshold: 10,
        onEnd: (detail) => {
          const deltaX = detail.deltaX;
          const deltaY = detail.deltaY;

          // On vérifie que le mouvement est surtout horizontal
          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
              // swipe vers la gauche -> mois suivant
              this.swipeDirection = 'left';
              this.nextMonth();
            } else {
              // swipe vers la droite -> mois précédent
              this.swipeDirection = 'right';
              this.prevMonth();
            }

            // On enlève l’effet visuel après un court délai
            setTimeout(() => {
              this.swipeDirection = null;
            }, 250);
          }
        },
      },
      true
    );

    this.calendarGesture?.enable(true);
  }

  ngOnDestroy(): void {
    this.calendarGesture?.destroy();
  }

  // 🔹 Chargement des événements depuis le backend
  private loadEventsFromBackend(): void {
    this.isLoadingEvents = true;
    this.loadError = undefined;

    this.http
      .get<AgendaApiItem[] | any>('https://glcbaudour.be/api/agenda')
      .subscribe({
        next: (data) => {
          console.log('Réponse /api/agenda :', data);

          let items: AgendaApiItem[] = [];

          // Cas 1 : l’API renvoie directement un tableau
          if (Array.isArray(data)) {
            items = data as AgendaApiItem[];
          }
          // Cas 2 : format { items: [...] }
          else if (data && Array.isArray(data.items)) {
            items = data.items as AgendaApiItem[];
          }
          // Cas 3 : format { data: [...] }
          else if (data && Array.isArray(data.data)) {
            items = data.data as AgendaApiItem[];
          } else {
            console.warn('Format de réponse inattendu pour /api/agenda');
            items = [];
          }

          this.events = items.map((it) => ({
            title: it.title,
            description: it.description,
            color: it.color,
            date: new Date(it.date),
            time: it.time,               // ⬅️ mappage du champ "time"
            imageUrl: it.image_url,      // ⬅️ mappage du champ "image_url"
          }));

          this.isLoadingEvents = false;
          // On régénère la grille avec les événements récupérés
          this.generateCalendarDays();
        },
        error: (err) => {
          console.error('Erreur lors du chargement de /api/agenda', err);
          this.isLoadingEvents = false;
          this.loadError =
            "Impossible de charger l'agenda pour le moment.";
          // On garde quand même un calendrier vide
          this.generateCalendarDays();
        },
      });
  }

  prevMonth(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentDate = new Date(year, month - 1, 1);
    this.updateMonthLabel();
    this.generateCalendarDays();
  }

  nextMonth(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentDate = new Date(year, month + 1, 1);
    this.updateMonthLabel();
    this.generateCalendarDays();
  }

  openDayDetails(day: CalendarDay): void {
    this.selectedDay = day;
    this.selectedDayLabel = this.formatDateLabel(day.date);
    this.isDayModalOpen = true;
  }

  closeDayDetails(): void {
    this.isDayModalOpen = false;
    this.selectedDay = null;
  }

  private updateMonthLabel(): void {
    this.monthLabel = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
    }).format(this.currentDate);
  }

  private generateCalendarDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = (firstOfMonth.getDay() + 6) % 7; // Lundi = 0
    const daysInMonth = lastOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Jours du mois précédent pour compléter la 1ère ligne
    for (let i = 0; i < startDayOfWeek; i++) {
      const date = new Date(year, month, 1 - (startDayOfWeek - i));
      days.push({
        date,
        inCurrentMonth: false,
        isToday: this.isToday(date),
        events: this.getEventsForDate(date),
      });
    }

    // Jours du mois courant
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      days.push({
        date,
        inCurrentMonth: true,
        isToday: this.isToday(date),
        events: this.getEventsForDate(date),
      });
    }

    // Compléter avec les jours du mois suivant jusqu’à un multiple de 7
    while (days.length % 7 !== 0) {
      const lastDate = days[days.length - 1].date;
      const nextDate = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth(),
        lastDate.getDate() + 1
      );
      days.push({
        date: nextDate,
        inCurrentMonth: false,
        isToday: this.isToday(nextDate),
        events: this.getEventsForDate(nextDate),
      });
    }

    this.days = days;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  private getEventsForDate(date: Date): CalendarEvent[] {
    const key = this.toDateKey(date);
    return this.events.filter((ev) => this.toDateKey(ev.date) === key);
  }

  private toDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  private formatDateLabel(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
}
