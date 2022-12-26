import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './listas-musicas.component.html',
  styleUrls: ['./listas-musicas.component.css']
})

export class ListasMusicasComponent implements OnInit {
  songs: any = []
  playlists: any = []

  playlist(result: any) {
    this.songs = []
    this.playlists = []

    for (let index = 0; index < result.length; index++) {
      this.playlists.push(result[index])
    }

    this.playlists.forEach((playlist: any, index: number) => {
      const city = playlist.city
      const temperature = playlist.temperature

      this.songs.push([])

      playlist.songs.forEach((song: any) => {
        if (!song) {
          return
        }

        this.songs[index].push(
          {
            name: song.name,
            category: song.category,
            date: song.date,
            city: city,
            temperature: temperature
          }
        )
      })
    })
  }

  deletePlaylist(index: number) {
    let songs = localStorage.getItem('songs')

    if (songs) {
      const result = JSON.parse(songs)

      result.splice(index, 1);

      localStorage.setItem('songs', JSON.stringify(result))

      this.playlist(result)
    }
  }

  ngOnInit(): void {
    let song = localStorage.getItem('songs')

    if (song) {
      const result = JSON.parse(song)

      this.playlist(result)
    }
  }
}
