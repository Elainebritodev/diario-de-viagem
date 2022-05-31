import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Diario } from 'src/app/core/models/diario';

@Component({
  selector: 'app-diario-edit',
  templateUrl: './diario-edit.component.html',
  styleUrls: ['./diario-edit.component.scss']
})
export class DiarioEditComponent implements OnInit {
  diario: Diario = {} as Diario;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Diario, //forma de passar dados para o diálogo - objeto enviado no open {data: diario}
    private ref: MatDialogRef<DiarioEditComponent>
  ) { }

  imagem?: File;

  setImage(ev: any) {
    //target é o input file
    this.imagem = ev.target.files[0];
  }

  onSubmit() {
    this.ref.close({ diario: this.diario, imagem: this.imagem });
  }

  ngOnInit(): void {
    this.diario = this.data;
  }

}
