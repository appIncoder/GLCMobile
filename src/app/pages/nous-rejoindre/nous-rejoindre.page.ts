import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nous-rejoindre',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './nous-rejoindre.page.html',
  styleUrls: ['./nous-rejoindre.page.scss'],
})
export class NousRejoindrePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
