import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, 
  IonTitle, IonContent,
  IonCardContent, IonImg, IonCard, IonModal, IonButton } from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface YoutubeVideo {
  title: string;
  link: string;
  thumbnailUrl: string;
  publishedAt: string;
  embedUrl?: SafeResourceUrl;
}

@Component({
  selector: 'app-glcmedia',
  templateUrl: './glcmedia.page.html',
  styleUrls: ['./glcmedia.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, 
    IonTitle, IonContent, IonCardContent, IonImg, IonCard, IonModal, IonButton,
  DatePipe, CommonModule],
})
export class GlcmediaPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  videos: YoutubeVideo[] = [];
  isLoading = false;
  error: string | null = null;
  isVideoModalOpen = false;
  selectedVideo: YoutubeVideo | null = null;

  // URL exacte de ton script PHP
  private readonly apiUrl = 'https://glcbaudour.be/api/glc-videos.php';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        const arr: any[] = Array.isArray(data)
          ? data
          : (typeof data === 'string'
              ? JSON.parse(data)
              : []);

        this.videos = arr.map((item, index) => {
          // On essaie de récupérer le thumbnail de manière robuste
          const explicit =
            item.thumbnailUrl ??
            item.thumbnailurl ??
            item.thumbnail_url ??
            item.thumbnail ??
            '';

          // Fallback : on cherche une string qui contient i.ytimg.com
          const fallback =
            explicit ||
            Object.values(item).find(
              (v) =>
                typeof v === 'string' &&
                v.includes('i.ytimg.com')
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

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des vidéos GLC Media :', err);
        this.error = 'Erreur lors du chargement des vidéos.';
        this.isLoading = false;
      },
    });
  }

  private extractYoutubeEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
      videoId = new URL(url).searchParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
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

}
  