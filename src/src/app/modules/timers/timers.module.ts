import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormComponent} from './components/form/form.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TimerComponent} from './components/timer/timer.component';
import {TimersComponent} from './components/timers/timers.component';
import {AddButtonComponent} from './components/add-button/add-button.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SharedModule} from '../shared/shared.module';
import {MatMenuModule} from '@angular/material/menu';
import {AddDialogComponent} from './components/add-dialog/add-dialog.component';
import {EditDialogComponent} from './components/edit-dialog/edit-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {AlarmDialogComponent} from './components/alarm-dialog/alarm-dialog.component';


@NgModule({
  declarations: [
    FormComponent,
    TimerComponent,
    TimersComponent,
    AddButtonComponent,
    AddDialogComponent,
    EditDialogComponent,
    AlarmDialogComponent
  ],
  exports: [
    FormComponent,
    TimersComponent
  ],
  imports: [
    CommonModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonToggleModule,
    SharedModule,
    MatMenuModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSelectModule
  ]
})
export class TimersModule {
}
