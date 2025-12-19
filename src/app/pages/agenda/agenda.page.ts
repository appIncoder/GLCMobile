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
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { Gesture, GestureController } from '@ionic/angular';
import type { RefresherCustomEvent } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface CalendarEvent {
  title: string;
  description?: string;
  color?: string;
  date: Date;
  time?: string;
  imageUrl?: string;
}

interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface AgendaApiItem {
  title: string;
  description?: string;
  color?: string;
  date: string;
  time?: string;
  image_url?: string;
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

    // ✅ refresher
    IonRefresher,
    IonRefresherContent,

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
    HttpClientModule,
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

  private events: CalendarEvent[] = [];

  isLoadingEvents = false;
  loadError?: string;

  private readonly AGENDA_API_URL = 'https://glcbaudour.be/api/agenda';

  constructor(
    private gestureCtrl: GestureController,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.updateMonthLabel();
    this.generateCalendarDays(); // calendrier vide
    this.loadEventsFromBackend(); // 1er chargement
  }

  // ✅ Pull-to-refresh (swipe vertical haut -> bas)
  doRefresh(event: RefresherCustomEvent) {
    this.loadEventsFromBackend(true, event);
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

          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
              this.swipeDirection = 'left';
              this.nextMonth();
            } else {
              this.swipeDirection = 'right';
              this.prevMonth();
            }

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
  private loadEventsFromBackend(
    forceRefresh = false,
    refresherEvent?: RefresherCustomEvent
  ): void {
    this.isLoadingEvents = !refresherEvent; // évite double spinner si pull-to-refresh
    this.loadError = undefined;

    const url = forceRefresh
      ? `${this.AGENDA_API_URL}?ts=${Date.now()}`
      : this.AGENDA_API_URL;

    this.http
      .get<AgendaApiItem[] | any>(url)
      .pipe(
        finalize(() => {
          this.isLoadingEvents = false;
          if (refresherEvent) refresherEvent.target.complete();
        })
      )
      .subscribe({
        next: (data) => {
          let items: AgendaApiItem[] = [];

          if (Array.isArray(data)) {
            items = data as AgendaApiItem[];
          } else if (data && Array.isArray(data.items)) {
            items = data.items as AgendaApiItem[];
          } else if (data && Array.isArray(data.data)) {
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
            time: it.time,
            imageUrl: it.image_url,
          }));

          // ✅ Important : regénère la grille avec les événements
          this.generateCalendarDays();
        },
        error: (err) => {
          console.error('Erreur lors du chargement de /api/agenda', err);
          this.loadError = "Impossible de charger l'agenda pour le moment.";

          // On garde quand même un calendrier (vide ou ancien)
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

    const startDayOfWeek = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastOfMonth.getDate();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      const date = new Date(year, month, 1 - (startDayOfWeek - i));
      days.push({
        date,
        inCurrentMonth: false,
        isToday: this.isToday(date),
        events: this.getEventsForDate(date),
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      days.push({
        date,
        inCurrentMonth: true,
        isToday: this.isToday(date),
        events: this.getEventsForDate(date),
      });
    }

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
