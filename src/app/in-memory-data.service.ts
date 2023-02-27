import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';
@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(){
    const heroes = [
      { id: 1, name: 'MS Office' },
      { id: 2, name: 'Java' },
      { id: 3, name: 'HTML' },
      { id: 4, name: 'CSS' },
      { id: 5, name: 'Java Script' },
      { id: 6, name: 'Python' },
      { id: 7, name: 'MY SQL' },
      { id: 8, name: 'Haskell' },
      { id: 9, name: 'Assembly' }
    ];
    return {heroes};
  }

  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1: 11;
  }

  constructor() { }
}
