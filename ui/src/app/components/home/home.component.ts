import { ViewportScroller } from '@angular/common';
import { HtmlParser } from '@angular/compiler';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, map, timer } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mainForm = this.formBuilder.group({ name: '' });
// 
  faces:any[] = [];

  continous: boolean = false;
  loading: boolean = false;
  unload: boolean = false;


  rnd = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
 
  constructor(
    private api:ApiService, 
    private router: Router, 
    private scroller: ViewportScroller,
    private formBuilder: FormBuilder,
    private devices: DeviceDetectorService) { }


  @HostListener('touchend', ['$event'])
  onTouch(e: TouchEvent) {   
    const t = e.target as HTMLElement;
    console.log('e', t.nodeName);
    

    if (t.nodeName != 'INPUT') {
      e.preventDefault();
    }
  }


  ngOnInit(): void {  
    for(let x=0; x < 24; x++) {
      this.faces.push({img: `/assets/faces/f-${x}.png`, off: true})
    }

    this.openFaces();
  }

  onSubmit() {
    if (!this.loading) {
      const tname = this.mainForm.getRawValue().name || '';
      this.loading = true;

      timer(3000).subscribe(() => {
        this.loading = false;
        this.unload = true;
        this.continous = false;
        this.closeFaces();
      });
    }
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
    const tname = this.mainForm.getRawValue().name || '';
    this.router.navigate([`/insights/${tname}`]);
  }

  onBlur() {
    this.scroller.scrollToPosition([0,0]);


    if (!this.devices.isDesktop) {
      this.onSubmit();
    }
  }
}  

