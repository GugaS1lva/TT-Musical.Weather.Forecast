import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  get(term: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')

    return this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${term}&units=metric&appid=541f65e7318dbea05ef9a0dc9d52a350`,{ headers })
  }

  constructor(
    private http: HttpClient
  ) { }
}
