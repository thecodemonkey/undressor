import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { DataValue } from './model/dataset';

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

  imgData = new StateProperty<DataValue[] | null>(null);

  public toggleNavbar() {
    this.navbarOn.val = !this.navbarOn.val;
  }
}