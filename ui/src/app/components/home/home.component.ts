import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { of, map, timer } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name = new FormControl('');
  faces:any[] = [];

  continous: boolean = false;
  loading: boolean = false;
  unload: boolean = false;


  rnd = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
 
  constructor(private api:ApiService, private router: Router) { }

  ngOnInit(): void {  
    for(let x=0; x < 24; x++) {
      this.faces.push({img: `/assets/faces/f-${x}.png`, off: true})
    }

    this.openFaces();
  }

  load() {
    const tname = this.name.getRawValue() || '';

    this.loading = true;

    timer(3000).subscribe(() => {
      this.loading = false;
      this.unload = true;
      this.continous = false;
      this.closeFaces();
    });
  }


  openFaces() {
    const off_faces = this.faces.filter(f => f.off);

    if (off_faces.length > 0 ) {
      off_faces[this.rnd(0, off_faces.length -1)].off = false;

      timer(100).subscribe(() => {this.openFaces()});
    } else {
      this.continous = true;
      this.flipFacesContinous();
    }
  }

  flipFacesContinous() {
    if (this.continous) {
      const off_f = this.faces.find(f => f.off);
      if(off_f) off_f.off = false; 
      
      
      this.faces[this.rnd(0, this.faces.length -1)].off = true;

      timer(3000).subscribe(() => { this.flipFacesContinous()});
    }
  }

  closeFaces() {
    const on_faces = this.faces.filter(f => !f.off);

    if (on_faces.length > 0 ) {
      on_faces[this.rnd(0, on_faces.length -1)].off = true;

      timer(50).subscribe(() => {this.closeFaces()});
    } else {

      timer(1000).subscribe(() => {
        this.goToInsightsView()
      });
      
    }    
  }

  goToInsightsView() {
    const tname = this.name.getRawValue() || '';
    this.router.navigate([`/insights/${tname}`]);
  }
}  

