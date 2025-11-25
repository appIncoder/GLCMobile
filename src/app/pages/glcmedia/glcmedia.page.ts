import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface YoutubeVideo {
  title: string;
  link: string;
  thumbnailUrl: string;
  publishedAt: string;
}

@Component({
  selector: 'app-glcmedia',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './glcmedia.page.html',
  styleUrls: ['./glcmedia.page.scss'],
})
export class GlcmediaPage implements OnInit {

  videos: YoutubeVideo[] = [];
  isLoading = false;
  error: string | null = null;

  // URL exacte de ton script PHP
  private readonly apiUrl = 'https://glcbaudour.be/api/glc-videos.php';

  constructor(
    private menuCtrl: MenuController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  async logAndToggle(ev?: Event) {
    try {
      await this.menuCtrl.enable(true, 'main-menu');
      await this.menuCtrl.toggle('main-menu');
    } catch (err) {
      console.error('[GLCMedia] menu toggle error:', err);
    }
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

          const video: YoutubeVideo = {
            title: item.title ?? '',
            link: item.link ?? '',
            thumbnailUrl: fallback as string,
            publishedAt: item.publishedAt ?? item.published_at ?? '',
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
}
