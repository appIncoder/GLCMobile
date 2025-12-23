import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonCardContent,
  IonImg,
  IonCard,
  IonModal,
  IonButton,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';

import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Gesture, GestureController } from '@ionic/angular';
import type { RefresherCustomEvent } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

import { Browser } from '@capacitor/browser';

export interface YoutubeVideo {
  title: string;
  link: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export interface PodcastEpisode {
  title: string;
  description?: string;
  audioUrl: string;
  publishedAt: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-glcmedia',
  templateUrl: './glcmedia.page.html',
  styleUrls: ['./glcmedia.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,

    IonRefresher,
    IonRefresherContent,

    IonCardContent,
    IonImg,
    IonCard,
    IonModal,
    IonButton,
    DatePipe,
    CommonModule,
  ],
})
export class GlcmediaPage implements OnInit, AfterViewInit, OnDestroy {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  @ViewChild('mediaWrapper', { read: ElementRef })
  mediaWrapper!: ElementRef;

  private swipeGesture?: Gesture;

  activeTab: 'videos' | 'podcasts' = 'videos';

  videos: YoutubeVideo[] = [];
  isLoadingVideos = false;
  errorVideos: string | null = null;

  podcasts: PodcastEpisode[] = [];
  isLoadingPodcasts = false;
  errorPodcasts: string | null = null;
  podcastsLoadedOnce = false;

  isPodcastModalOpen = false;
  selectedPodcast: PodcastEpisode | null = null;

  private readonly apiVideosUrl = 'https://glcbaudour.be/api/videos';
  private readonly apiPodcastsUrl = 'https://glcbaudour.be/api/podcasts';

  constructor(
    private http: HttpClient,
    private gestureCtrl: GestureController
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  doRefresh(event: RefresherCustomEvent) {
    if (this.activeTab === 'videos') {
      this.loadVideos(true, event);
    } else {
      this.loadPodcasts(true, event);
    }
  }

  ngAfterViewInit(): void {
    const el = this.mediaWrapper?.nativeElement;
    if (!el) return;

    this.swipeGesture = this.gestureCtrl.create(
      {
        el,
        gestureName: 'glcmedia-swipe',
        direction: 'x',
        threshold: 10,
        onEnd: (detail) => {
          const deltaX = detail.deltaX;
          const deltaY = detail.deltaY;

          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) this.switchToTab('videos');
            else this.switchToTab('podcasts');
          }
        },
      },
      true
    );

    this.swipeGesture?.enable(true);
  }

  ngOnDestroy(): void {
    this.swipeGesture?.destroy();
  }

  switchToTab(tab: 'videos' | 'podcasts') {
    if (this.activeTab === tab) return;

    this.activeTab = tab;

    if (tab === 'podcasts' && !this.podcastsLoadedOnce) {
      this.loadPodcasts();
    }
  }

  loadVideos(forceRefresh = false, refresherEvent?: RefresherCustomEvent): void {
    this.isLoadingVideos = !refresherEvent;
    this.errorVideos = null;

    const url = forceRefresh ? `${this.apiVideosUrl}?ts=${Date.now()}` : this.apiVideosUrl;

    this.http
      .get<any>(url)
      .pipe(
        finalize(() => {
          this.isLoadingVideos = false;
          if (refresherEvent) refresherEvent.target.complete();
        })
      )
      .subscribe({
        next: (data) => {
          const arr: any[] = Array.isArray(data)
            ? data
            : typeof data === 'string'
            ? JSON.parse(data)
            : [];

          this.videos = arr.map((item) => {
            const explicit =
              item.thumbnailUrl ??
              item.thumbnailurl ??
              item.thumbnail_url ??
              item.thumbnail ??
              '';

            const fallback =
              explicit ||
              Object.values(item).find(
                (v) => typeof v === 'string' && v.includes('i.ytimg.com')
              ) ||
              '';

            return {
              title: item.title ?? '',
              link: item.link ?? '',
              thumbnailUrl: fallback as string,
              publishedAt: item.publishedAt ?? item.published_at ?? '',
            } as YoutubeVideo;
          });
        },
        error: (err) => {
          console.error('❌ Erreur lors du chargement des vidéos GLC Media :', err);
          this.errorVideos = 'Erreur lors du chargement des vidéos.';
        },
      });
  }

  loadPodcasts(forceRefresh = false, refresherEvent?: RefresherCustomEvent): void {
    this.isLoadingPodcasts = !refresherEvent;
    this.errorPodcasts = null;

    const url = forceRefresh ? `${this.apiPodcastsUrl}?ts=${Date.now()}` : this.apiPodcastsUrl;

    this.http
      .get<any>(url)
      .pipe(
        finalize(() => {
          this.isLoadingPodcasts = false;
          if (refresherEvent) refresherEvent.target.complete();
        })
      )
      .subscribe({
        next: (data) => {
          const arr: any[] = Array.isArray(data)
            ? data
            : typeof data === 'string'
            ? JSON.parse(data)
            : [];

          this.podcasts = arr.map((item) => ({
            title: item.title ?? '',
            description: item.description ?? '',
            audioUrl: item.audioUrl ?? item.audio_url ?? '',
            publishedAt: item.publishedAt ?? item.published_at ?? '',
            imageUrl: item.imageUrl ?? item.image_url ?? '',
          })) as PodcastEpisode[];

          this.podcastsLoadedOnce = true;
        },
        error: (err) => {
          console.error('❌ Erreur lors du chargement des podcasts :', err);
          this.errorPodcasts = 'Erreur lors du chargement des podcasts.';
          this.podcastsLoadedOnce = true;
        },
      });
  }

  // ✅ Ouverture YouTube dans le navigateur système (iOS-safe)
  async openYoutubeVideo(video: YoutubeVideo) {
    const url = (video?.link || '').trim();
    if (!url) return;

    try {
      await Browser.open({ url });
    } catch (e) {
      console.error('Impossible d’ouvrir YouTube:', e);
      // Optionnel: afficher un toast si tu en utilises déjà un ailleurs
    }
  }

  openPodcastPlayer(podcast: PodcastEpisode) {
    this.selectedPodcast = podcast;
    this.isPodcastModalOpen = true;
  }

  closePodcastPlayer() {
    this.isPodcastModalOpen = false;
    this.selectedPodcast = null;
  }
}
