import { ViewportScroller } from '@angular/common';
import { HtmlParser } from '@angular/compiler';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild("fcname") fcName: FormControl;

// 
  faces:any[] = [];

  continous: boolean = false;
  loading: boolean = false;
  unload: boolean = false;
  encname: String | null | undefined;

  notexists: boolean = false;


  rnd = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
 
  constructor(
    private api:ApiService, 
    private router: Router, 
    private scroller: ViewportScroller,
    private formBuilder: FormBuilder,
    private devices: DeviceDetectorService) { 
      this.fcName = this.mainForm.controls.name;

    }


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
    this.encname = null;

    if (!this.loading && this.name) {
      
      (<any> this.fcName).nativeElement.blur();
      this.loading = true;


      this.api.getUser(this.name).subscribe(en => {

        console.log('users name is: ', en);

        if (en !== 'NOT EXISTS') {
          this.notexists = false;
          this.encname = en;
          this.unload = true;
          this.continous = false;
          this.closeFaces();
        } 
        else 
        {
          this.notexists = true;
        }

        this.loading = false;
      })


      // timer(3000).subscribe(() => {
      //   this.loading = false;
      //   this.unload = true;
      //   this.continous = false;
      //   this.closeFaces();
      // });
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
    // const tname = this.mainForm.getRawValue().name || '';
    this.router.navigate([`/insights/${this.encname}`]);
  }

  onBlur() {
    this.scroller.scrollToPosition([0,0]);


    if (this.devices.isMobile()) {
      this.onSubmit();
    }
  }

  onFocus() {
    this.notexists = false;
  }

  get name() {
    return this.mainForm.getRawValue().name || '';
  }
}  

