import { Injectable } from '@angular/core';
import * as localforage from 'localforage'; // this works!!!


@Injectable({
  providedIn: 'root'
})
export class LocalForageService {

  constructor() {
    localforage.config({
      name: 'HA Marketplace Storage'
    });
  }

  get(key: string) {
    return localforage.getItem(key);
  }

  set(key: string, value: any) {
    return localforage.setItem(key, value);
  }

  remove(key: string) {
    return localforage.removeItem(key);
  }

  DELETE_ALL() {
    return localforage.clear();
  }

  listKeys() {
    return localforage.keys();
  }
}
