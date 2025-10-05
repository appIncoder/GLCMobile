import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mot-du-pasteur',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './mot-du-pasteur.page.html',
  styleUrls: ['./mot-du-pasteur.page.scss'],
})
export class MotDuPasteurPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
