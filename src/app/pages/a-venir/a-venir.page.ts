import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-a-venir',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './a-venir.page.html',
  styleUrls: ['./a-venir.page.scss'],
})
export class AVenirPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
