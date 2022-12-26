import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { WeatherService } from '../services/weather.service';
import { MessageService } from 'primeng/api';
import { ShazamService } from '../services/shazam.service';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private formbuilder: UntypedFormBuilder,
    private weatherService: WeatherService,
    private messageService: MessageService,
    private shazamService: ShazamService
  ) { }

  forms = {
    'clima-form': this.formbuilder.group({
      'clima-form-input': this.formbuilder.control({ value: '', disabled: false }),
    })
  }

  icon = 'sun'
  title = 'MusicalWeatherForecast';
  loading = true;
  loadingInternal = false;
  loadingTimeOut!: NodeJS.Timeout
  loadingSongs = false
  city = ''
  date = ''
  country = ''
  temperature!: number
  weatherDescription = ''
  songs = [
    {
      name: '',
      category: '',
      image: '',
      date: '',
    },
  ]

  handleSubmit() {
    this.loadingInternal = true

    const formgroup = this.forms['clima-form']

    const inputValue = (formgroup.get('clima-form-input')?.value)

    formgroup.patchValue({
      'clima-form-input': ''
    })

    this.request(inputValue)
  }

  onNotify(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  saveSongs() {
    const newSong = {
      songs: this.songs,
      city: this.city,
      temperature: this.temperature
    }

    const songs = localStorage.getItem('songs')

    if (songs) {
      localStorage.setItem('songs', JSON.stringify([...JSON.parse(songs), newSong]))

    } else {
      localStorage.setItem('songs', JSON.stringify([newSong]))

    }

    console.log({
      songs: this.songs,
      city: this.city,
      temperature: this.temperature
    });

    this.onNotify('success', 'PLAYLIST SALVA', 'Confira suas playlist na página das playlists.')
  }

  request(term: string) {
    this.weatherService.get(term).subscribe({
      next: (apiResponse) => {
        console.log(apiResponse);

        const date = new Date()
        this.date = String(date.getUTCDate()) + '/' + String(date.getUTCMonth() + 1) + '/' + String(date.getUTCFullYear())

        this.city = apiResponse.name
        this.country = apiResponse.sys.country
        this.temperature = parseInt(apiResponse.main.temp)
        this.weatherDescription = apiResponse.weather[0].description

        // Caso a temperatura seja maior que 32 graus, deverá retornar Rock;
        // Caso a temperatura seja menor que 32 e maior 24, deverá retornar Pop;
        // Caso a temperatura seja menor que 24 e maior que 16, devera retornar Classica;
        // E caso a temperatura seja menor que 16, deverá retornar Lofi.

        let songCategory = ''

        if (this.temperature > 32) {
          songCategory = 'rock'
          this.icon = 'sun'

        } else if (this.temperature < 32 && this.temperature > 24) {
          songCategory = 'pop'
          this.icon = 'cloud'

        } else if (this.temperature <= 24 && this.temperature > 16) {
          songCategory = 'classica'
          this.icon = 'rain'

        } else if (this.temperature < 16) {
          songCategory = 'lofi'
          this.icon = 'snow'

        } else {
          this.loadingSongs = true

        }

        this.shazamService.get(songCategory).subscribe({
          next: (shazamApiResponse) => {
            console.log(shazamApiResponse);

            if (!shazamApiResponse) {
              return
            }

            this.songs = []

            shazamApiResponse.tracks.hits.forEach((song: any) => {
              if (!song) {
                return
              }

              this.songs.push(
                {
                  name: song.track.title,
                  category: songCategory,
                  image: song.track.images.coverart,
                  date: String(date.getUTCDate()) + '/' + String(date.getUTCMonth() + 1) + '/' + String(date.getUTCFullYear()) + ' ' + String(date.getHours()) + ':' + String(date.getMinutes()),
                }
              )
            })
          },

          error: (error) => {
            console.log(error);
          }
        })
      },
      error: (error) => {
        this.onNotify('info', 'CIDADE NÃO ENCONTRADA!', 'O campo de busca foi preenchido incorretamente ou a cidade não existe.')
      },
      complete: () => {
        this.loading = false
        this.loadingInternal = false
      }
    })
  }

  ngOnInit(): void {
    this.request('Maceio')
  }

  ngOnDestroy(): void {
    if (this.loadingTimeOut) {
      clearTimeout(this.loadingTimeOut)
    }
  }
}