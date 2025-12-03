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
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Gesture, GestureController } from '@ionic/angular';

export interface YoutubeVideo {
  title: string;
  link: string;
  thumbnailUrl: string;
  publishedAt: string;
  embedUrl?: SafeResourceUrl;
}

export interface PodcastEpisode {
  title: string;
  description?: string;
  audioUrl: string;
  publishedAt: string;
  imageUrl?: string;   // ⬅️ nouveau
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

  // 🟦 Onglet actif : 'videos' ou 'podcasts'
  activeTab: 'videos' | 'podcasts' = 'videos';

  // 🎥 Vidéos YouTube
  videos: YoutubeVideo[] = [];
  isLoadingVideos = false;
  errorVideos: string | null = null;

  // 🎧 Podcasts
  podcasts: PodcastEpisode[] = [];
  isLoadingPodcasts = false;
  errorPodcasts: string | null = null;
  podcastsLoadedOnce = false;

  // Modal vidéo
  isVideoModalOpen = false;
  selectedVideo: YoutubeVideo | null = null;

  // Modal podcast
  isPodcastModalOpen = false;
  selectedPodcast: PodcastEpisode | null = null;

  // URLs des APIs PHP
  private readonly apiVideosUrl = 'https://glcbaudour.be/api/glc-videos.php';
  private readonly apiPodcastsUrl = 'https://glcbaudour.be/api/podcasts';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private gestureCtrl: GestureController
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  ngAfterViewInit(): void {
    const el = this.mediaWrapper?.nativeElement;
    if (!el) {
      console.warn('mediaWrapper non trouvé');
      return;
    }

    this.swipeGesture = this.gestureCtrl.create(
      {
        el,
        gestureName: 'glcmedia-swipe',
        direction: 'x',
        threshold: 10,
        onEnd: (detail) => {
          const deltaX = detail.deltaX;
          const deltaY = detail.deltaY;

          // Mouvement surtout horizontal
          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
              // 👉 swipe vers la droite : aller vers les podcasts
              this.switchToTab('videos');
            } else {
              // 👈 swipe vers la gauche : revenir aux vidéos
              this.switchToTab('podcasts');
            }
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

  // Changement d’onglet (via swipe ou clic sur l’onglet)
  switchToTab(tab: 'videos' | 'podcasts') {
    if (this.activeTab === tab) {
      return;
    }

    this.activeTab = tab;

    // Si on passe aux podcasts pour la première fois, on charge
    if (tab === 'podcasts' && !this.podcastsLoadedOnce) {
      this.loadPodcasts();
    }
  }

  // 🔹 Chargement des vidéos
  loadVideos(): void {
    this.isLoadingVideos = true;
    this.errorVideos = null;

    this.http.get<any>(this.apiVideosUrl).subscribe({
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

          const embedUrl = this.extractYoutubeEmbedUrl(item.link ?? '');
          const video: YoutubeVideo = {
            title: item.title ?? '',
            link: item.link ?? '',
            thumbnailUrl: fallback as string,
            publishedAt: item.publishedAt ?? item.published_at ?? '',
            embedUrl: embedUrl,
          };

          return video;
        });

        this.isLoadingVideos = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des vidéos GLC Media :', err);
        this.errorVideos = 'Erreur lors du chargement des vidéos.';
        this.isLoadingVideos = false;
      },
    });
  }

  // 🔹 Chargement des podcasts
  loadPodcasts(): void {
    this.isLoadingPodcasts = true;
    this.errorPodcasts = null;

    this.http.get<any>(this.apiPodcastsUrl).subscribe({
      next: (data) => {
        const arr: any[] = Array.isArray(data)
          ? data
          : typeof data === 'string'
          ? JSON.parse(data)
          : [];

this.podcasts = arr.map((item) => {
  const episode: PodcastEpisode = {
    title: item.title ?? '',
    description: item.description ?? '',
    audioUrl: item.audioUrl ?? item.audio_url ?? '',
    publishedAt: item.publishedAt ?? item.published_at ?? '',
    imageUrl: item.imageUrl ?? item.image_url ?? '',   // ⬅️ ici
  };
  return episode;
});


        this.isLoadingPodcasts = false;
        this.podcastsLoadedOnce = true;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des podcasts :', err);
        this.errorPodcasts = 'Erreur lors du chargement des podcasts.';
        this.isLoadingPodcasts = false;
        this.podcastsLoadedOnce = true;
      },
    });
  }

  private extractYoutubeEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';

    try {
      if (url.includes('youtube.com/watch')) {
        videoId = new URL(url).searchParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
    } catch {
      videoId = '';
    }

    if (videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}?autoplay=1`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  openVideoPlayer(video: YoutubeVideo) {
    this.selectedVideo = video;
    this.isVideoModalOpen = true;
  }

  closeVideoPlayer() {
    this.isVideoModalOpen = false;
    this.selectedVideo = null;
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
