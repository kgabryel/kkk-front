import {AngularEditorConfig} from '@kolkov/angular-editor';

export const editorConfig: AngularEditorConfig = {
  editable: true,
  height: '300px',
  fonts: [
    {class: 'arial', name: 'Arial'},
    {class: 'times-new-roman', name: 'Times New Roman'},
    {class: 'calibri', name: 'Calibri'},
    {class: 'comic-sans-ms', name: 'Comic Sans MS'}
  ],
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
    [
      'insertImage',
      'insertVideo',
      'customClasses',
      'subscript',
      'superscript',
      'backgroundColor',
      'toggleEditorMode'
    ]
  ]
};
