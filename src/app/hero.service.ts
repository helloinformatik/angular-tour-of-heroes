import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** Get heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched Sprachen')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /** get hero by id. return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
        .pipe (
            map(heroes => heroes[0]),
            tap(h => {
                const outcome = h ? 'fetched' : ' did not find';
                this.log(`${outcome} hero id=${id}`);
            }),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched Sprache id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
        return of ([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found Sprachen matching "${term}"`) :
        this.log(`no Sparchen matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchSprachen', []))
    );
  }

 addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added Sprache id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addSprache'))
    );
  }

 deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Sprache id=${id}`)),
      catchError(this.handleError<Hero>('deleteSprache'))
    );
 }

 updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated Sprache id=${hero.id}`)),
      catchError(this.handleError<any>('updateSprache'))
    );
 }

 private handleError<T>(operation = 'operation', result?:T){
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
 }

  private log(message: string) {
    this.messageService.add(`SprachenService: ${message}`);
  }
}
