import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShazamService {
  get(term: string) {
    console.log(term);

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')

      .set('X-RapidAPI-Key', 'd96fdccd7fmsh9acae3f6fb00c8cp1f3a67jsnee18a02eb910')
    // CONTA 01 - 28d236d289msh0b7dadf30323533p1af9edjsnf012999dc2d4
    // CONTA 02 - d96fdccd7fmsh9acae3f6fb00c8cp1f3a67jsnee18a02eb910

    const querystring: Array<string> = []

    Object.entries({ term, locale: 'en-US', offset: '0', limit: '5' }).forEach(([filter, value]) => {
      if (value !== null && value !== undefined) {
        querystring.push(`${filter}=${value}`)
      }
    })

    console.log(`https://shazam.p.rapidapi.com/search?${querystring.join('&')}`, { headers });


    return this.http.get<any>(`https://shazam.p.rapidapi.com/search?${querystring.join('&')}`, { headers })
  }

  constructor(
    private http: HttpClient
  ) { }
}
