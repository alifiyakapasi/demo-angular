import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
@Component({
  selector: 'app-form-fields',
  standalone: true,
  imports: [MatRadioModule, FormsModule, MatButton],
  templateUrl: './form-fields.component.html',
  styleUrl: './form-fields.component.scss',
})
export class FormFieldsComponent {
  favoriteSeason!: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
}
