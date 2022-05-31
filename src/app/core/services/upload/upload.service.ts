import { Injectable } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private storage: Storage) { }

  //Objetiva-se diminuir a possibilidade de grarar o mesmo numero
  private createFileName(file: File): string { //o File já é do javascript - é um blob (objeto)
    //batata.jpg
    const ext = file.name.split('.').pop();
    //split -> separa pelo nome; pop -> pega so o final com a extensão do arquivo - jpg
    const name = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    //Date.now()->pega o tempo agora em milisegundos
    //${Math.floor(Math.random() * 1000) ->
    //Math.random()  -> da um numero aleatorio de 0 ate 0.999(nunca ate 1)
    //floor arredonda para pegar so a parte inteira
    // Entao eu multiplico por 1000 - pode surgir ate 999 (nunca mil)

    return `${name}.${ext}`; //12356258524.jpg
  }
  //folder indica a pasta para salvar o file
  //folder pode ser /diarios/fx125/
  //retorna o link da imagem ou null
  upload(file?: File, folder?: string): Observable<string | null> {
    if (file) {
      const filename = this.createFileName(file);
      const fileRef = ref(this.storage, folder + filename); //Ex. /diarios/fx125/1254.jpg
      return from(uploadBytes(fileRef, file)).pipe(
        switchMap(() => from(getDownloadURL(fileRef))) //upload é realizado e depois o link é solicitado
      );
    } else {
      return of(null); //se nao for feito upload
    }
  }
}
