import { Injectable } from '@angular/core';
import {
  addDoc,
  collectionData,
  docData,
  Firestore,
  where,
} from '@angular/fire/firestore';
import { collection, deleteDoc, doc, query, updateDoc } from '@firebase/firestore';
import { from, Observable, switchMap, first } from 'rxjs';
import { UsuarioNaoVerificadoComponent } from 'src/app/auth/components/usuario-nao-verificado/usuario-nao-verificado.component';
import { DiariosRoutingModule } from 'src/app/diarios/diarios-routing.module';
import { Diario, DiarioConverter } from '../../models/diario';
import { AuthService } from '../auth/auth.service';
import { UploadService } from '../upload/upload.service';

@Injectable({
  providedIn: 'root',
})
export class DiariosService {
  constructor(
    private db: Firestore,
    private authService: AuthService,
    private uploadService: UploadService,
  ) { }
  // Referência a uma possível coleção do firestore
  diarios = collection(this.db, 'diarios').withConverter(DiarioConverter);

  getTodosDiarios(): Observable<Diario[]> {
    // collectionData - extrai listagem dos diários da coleção
    // { idField: 'id' } - solicita p/ o banco adicionar essa propriedade dentro do objeto já preenchida
    return collectionData(this.diarios, { idField: 'id' });
  }

  getDiariosUsuario(): Observable<Diario[]> {
    return this.authService.logged.pipe(
      first(),
      switchMap((user) => {
        return collectionData(
          query(this.diarios, where('usuarioId', '==', user?.uid)),
          { idField: 'id' }
        );
      })
    );

    // return collectionData(
    //   query(this.diarios, where('usuarioId', '==', this.authService.uid)),
    //   { idField: 'id' }
    // );
  }

  getDiarioById(id: string): Observable<Diario> {
    const diarioDoc = doc(this.diarios, id); // indica o local do documento na coleção
    return docData(diarioDoc, { idField: 'id' });
  }

  addDiario(diario: Diario, imagem?: File) {
    return this.authService.userData.pipe(
      switchMap((user) => {
        return this.uploadService
          .upload(imagem, `diarios/${this.authService.uid}/`)
          .pipe(
            switchMap((url) => {
              diario.usuarioId = this.authService.uid;
              diario.createdAt = new Date();
              diario.imagem = url ?? `assets/img/placeholder.png`;
              diario.usuarioNick = user['nick'];
              diario.usuarioName = user['nome'];
              return from(addDoc(this.diarios, diario)); //no fim add tudo como um observable
            })
          );
      })
    );
  }

  editDiario(diario: Diario, imagem?: File) {
    const diarioDoc = doc(this.diarios, diario.id);
    return this.uploadService.upload(imagem, `diarios/${diario.usuarioId}/`)
      .pipe(
        switchMap((url) => {
          return from(updateDoc(diarioDoc, { ...diario, imagem: url ?? diario.imagem }));
        })
      );
  }


  deleteDiario(diario: Diario) {
    const diarioDoc = doc(this.diarios, diario.id);
    return from(deleteDoc(diarioDoc));
  }
}

/**
 * ADICIONAR NOVO DIÁRIO
 * ATUALIZAR DIÁRIO
 * DELETAR DIÁRIO
 */

/**
 * Como fazer uma query no firestore?
 *
 * 1) Determine a coleção para buscar os dados
 * Ex: produtos = collection(this.db, 'produtos')
 * Obs: Caso os documentos de produto possuírem data é importante
 * utilizar um ProdutoConverter: Converter<Produto>.
 *
 * 2) Agora é necessário criar a query, pode fazer separadamente:
 *
 * const w = where('preco', '>=', 50.0); // produtos com preco maior ou igual a 50.0
 * const q = query(this.produtos, w);
 *
 * return collectionData(q, { idField: 'id'})
 *
 */