import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Season} from '../../../../core/models/season';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/seasons/reducers';
import {FormGroup} from '@angular/forms';
import {formNames, SeasonsFormFactory, SeasonsFormNames} from '../../../../core/factories/seasons.factory';
import {seasonErrors, SeasonErrors} from '../../../../core/errors/season.error';
import {Month, months} from '../../../../config/months.config';
import cloneDeep from 'lodash/cloneDeep';
import {UpdateSeasonRequest} from '../../../../core/requests/season.request';
import {seasonUpdate} from '../../../../core/store/seasons/actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'seasons-season-edit',
  templateUrl: './season-edit.component.html',
  styleUrls: ['./season-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonEditComponent implements OnInit, OnDestroy {
  @Input() public season: Season;
  public form: FormGroup;
  public formNames: SeasonsFormNames;
  public errors: SeasonErrors;
  public startMonths: Month[];
  public endMonths: Month[];
  @Output() private edit: EventEmitter<boolean>;
  private store: Store<State>;
  private subscriptions: (Subscription | undefined)[];
  private seasonFormFactory: SeasonsFormFactory;

  public constructor(store: Store<State>, seasonFormFactory: SeasonsFormFactory) {
    this.edit = new EventEmitter();
    this.store = store;
    this.formNames = formNames;
    this.errors = seasonErrors;
    this.startMonths = cloneDeep(months);
    this.endMonths = cloneDeep(months);
    this.seasonFormFactory = seasonFormFactory;
  }

  public ngOnInit(): void {
    this.form = this.seasonFormFactory.getEditForm();
    this.endMonths.forEach((month, index, endMonths) => {
      if (endMonths[index].value < this.season.start) {
        endMonths[index].disabled = true;
      }
    });
    this.startMonths.forEach((month, index, startMonths) => {
      if (startMonths[index].value > this.season.stop) {
        startMonths[index].disabled = true;
      }
    });
    this.form.get(this.formNames.startMonth)?.setValue(this.season.start);
    this.form.get(this.formNames.endMonth)?.setValue(this.season.stop);
    this.subscriptions = [
      this.form.get(this.formNames.startMonth)?.valueChanges.subscribe(startMonth => {
        this.endMonths.forEach((month, index, endMonths) => {
          if (endMonths[index].value < startMonth) {
            endMonths[index].disabled = true;
          }
        });
      }),
      this.form.get(this.formNames.endMonth)?.valueChanges.subscribe(endMonth => {
        this.startMonths.forEach((month, index, startMonths) => {
          if (startMonths[index].value > endMonth) {
            startMonths[index].disabled = true;
          }
        });
      })
    ];
  }

  public stopEdit(): void {
    this.edit.emit(false);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const request: UpdateSeasonRequest = {
      start: parseInt(this.form.get(this.formNames.startMonth)?.value),
      stop: parseInt(this.form.get(this.formNames.endMonth)?.value)
    };
    this.store.dispatch(seasonUpdate({id: this.season.id, season: request}));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    });
  }
}
