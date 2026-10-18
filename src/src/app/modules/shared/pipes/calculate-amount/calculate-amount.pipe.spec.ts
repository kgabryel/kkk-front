import {CalculateAmountPipe} from './calculate-amount.pipe';

describe('CalculateAmountPipe', () => {
  it('create an instance', () => {
    const pipe = new CalculateAmountPipe();
    expect(pipe).toBeTruthy();
  });
});
