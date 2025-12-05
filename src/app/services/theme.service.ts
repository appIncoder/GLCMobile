import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode$ = new BehaviorSubject<boolean>(true);

  constructor() {
    // Charger la préférence sauvegardée
    const saved = localStorage.getItem('app-theme');
    if (saved === 'light') {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }

  isDarkMode(): boolean {
    return this.darkMode$.value;
  }

  setDarkMode(save = true) {
    document.body.classList.remove('light-theme');
    // le root sans classe = mode dark
    this.darkMode$.next(true);
    if (save) {
      localStorage.setItem('app-theme', 'dark');
    }
  }

  setLightMode(save = true) {
    document.body.classList.add('light-theme');
    this.darkMode$.next(false);
    if (save) {
      localStorage.setItem('app-theme', 'light');
    }
  }

  toggleTheme() {
    if (this.darkMode$.value) {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }
}
