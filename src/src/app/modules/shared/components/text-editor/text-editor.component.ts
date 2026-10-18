import { Component, input, InputSignal } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';

@Component({
  imports: [NgxEditorComponent, NgxEditorMenuComponent, ReactiveFormsModule],
  selector: 'shared-text-editor',
  standalone: true,
  styleUrl: './text-editor.component.scss',
  templateUrl: './text-editor.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class TextEditorComponent {
  public controlName: InputSignal<string> = input.required<string>();
  public editor: Editor;
  public toolbar: Toolbar;
  public constructor() {
    this.editor = new Editor();
    this.toolbar = [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];
  }
}
