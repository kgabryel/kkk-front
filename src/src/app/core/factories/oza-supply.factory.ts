import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export interface OzaSupplyFormNames {
  supply: string;
  supplySearch: string;
}

export const formNames: OzaSupplyFormNames = {
  supply: 'supply',
  supplySearch: 'supplySearch'
};

@Injectable()
export class OzaSupplyFactory {
  public static getForm(supplyId: number | null, supplyName: string | null): FormGroup {
    return new FormGroup({
      [formNames.supply]: new FormControl(supplyId, [Validators.required]),
      [formNames.supplySearch]: new FormControl(supplyName, [Validators.required])
    });
  }
}
