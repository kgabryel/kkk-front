import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../../core/models/tag';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames, TagFormFactory, TagsFormNames} from '../../../../core/factories/tag.factory';
import {tagUpdate} from '../../../../core/store/tags/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tags/reducers';
import {TagErrors, tagErrors} from '../../../../core/errors/tag.error';
import {Length} from '../../../../config/form.config';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'tags-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagEditComponent implements OnInit {
  @Input() public tag: Tag;
  public nameLength$: Observable<number>;
  public form: FormGroup;
  public formNames: TagsFormNames;
  public errors: TagErrors;
  public name: string;
  public maxNameLength: number;
  @Output() private edit: EventEmitter<boolean>;
  private store: Store<State>;
  private tagFormFactory: TagFormFactory;

  public constructor(store: Store<State>, tagFormFactory: TagFormFactory) {
    this.edit = new EventEmitter();
    this.formNames = formNames;
    this.store = store;
    this.tagFormFactory = tagFormFactory;
    this.errors = tagErrors;
    this.maxNameLength = Length.maxTagNameLength;
  }

  public ngOnInit(): void {
    this.name = this.tag.name;
    this.form = this.tagFormFactory.getForm(this.tag.id);
    this.nameLength$ = (this.form.get(this.formNames.name) as FormControl).valueChanges.pipe(
      startWith(this.tag.name.length),
      map(value => value.length)
    );
    this.form.get(this.formNames.name)?.setValue(this.tag.name);
  }

  public stopEdit(): void {
    this.edit.emit(false);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(tagUpdate({
      id: this.tag.id,
      name: this.form.get(this.formNames.name)?.value
    }));
  }
}
