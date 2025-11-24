import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface YoutubeVideo {
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

  constructor(
    private menuCtrl: MenuController,
    private http: HttpClient
  ) {}

  // État d’affichage
  videos: YoutubeVideo[] = [];
  isLoading = false;
  error: string | null = null;

  // Flux RSS YouTube du GLC Baudour
  private readonly rssUrl =
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCQFrskKCZyZ6SEg6EbBda2A';

  ngOnInit() {
    this.loadVideos();
  }

  async logAndToggle(ev?: Event) {
    try {
      await this.menuCtrl.enable(true, 'main-menu');
      const res = await this.menuCtrl.toggle('main-menu');
    } catch (err) {
      console.error('[Accueil] menu toggle error:', err);
    }
  }

  // Chargement des vidéos
  loadVideos() {
    this.isLoading = true;
    this.error = null;

    this.http.get(this.rssUrl, { responseType: 'text' }).subscribe({
      next: (xmlString) => {
        try {
          this.videos = this.parseRss(xmlString).slice(0, 10); // on garde les 10 plus récentes
        } catch (e) {
          console.error('RSS parse error', e);
          this.error = 'Impossible de lire les vidéos YouTube pour le moment.';
        } finally {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('RSS load error', err);
        this.error = 'Erreur lors du chargement des vidéos YouTube.';
        this.isLoading = false;
      },
    });
  }

  // Parsing du flux RSS YouTube
  private parseRss(xmlString: string): YoutubeVideo[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const entries = Array.from(doc.getElementsByTagName('entry'));

    return entries.map((entry) => {
      const title = entry.getElementsByTagName('title')[0]?.textContent ?? '';

      const linkEl = entry.getElementsByTagName('link')[0] as Element | undefined;
      const link = linkEl?.getAttribute('href') ?? '';

      const published = entry.getElementsByTagName('published')[0]?.textContent ?? '';

      // Récupération du thumbnail via Media RSS
      let thumbnailUrl = '';
      const mediaNs = 'http://search.yahoo.com/mrss/';
      let thumbEls: HTMLCollectionOf<Element> | NodeListOf<Element> | null = null;

      if ((entry as any).getElementsByTagNameNS) {
        thumbEls = (entry as any).getElementsByTagNameNS(mediaNs, 'thumbnail');
      }

      if (!thumbEls || thumbEls.length === 0) {
        // fallback si le support des namespaces est limité
        thumbEls = entry.getElementsByTagName('media:thumbnail') as any;
      }

      if (thumbEls && thumbEls.length > 0) {
        thumbnailUrl = (thumbEls[0] as Element).getAttribute('url') ?? '';
      }

      return {
        title,
        link,
        thumbnailUrl,
        publishedAt: published,
      };
    });
  }
}
