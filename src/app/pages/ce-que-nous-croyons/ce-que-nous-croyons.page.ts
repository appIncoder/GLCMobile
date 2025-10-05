import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ce-que-nous-croyons',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './ce-que-nous-croyons.page.html',
  styleUrls: ['./ce-que-nous-croyons.page.scss'],
})
export class CeQueNousCroyonsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
