import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export class StateProperty<T> {

  private readonly propertySubject;
  readonly val$;

  constructor(initValue: T) {
    this.propertySubject = new BehaviorSubject<T>(initValue);
    this.val$ = this.propertySubject.asObservable();
  }

  get val(): T {
    return this.propertySubject.getValue();
  }

  set val(val) {
    this.propertySubject.next(val);
  }
}


@Injectable({providedIn: 'root'})
export class State {
  navbarOn = new StateProperty<boolean>(false);
  activePage = new StateProperty<string>('');

  public toggleNavbar() {
    this.navbarOn.val = !this.navbarOn.val;
  }
}