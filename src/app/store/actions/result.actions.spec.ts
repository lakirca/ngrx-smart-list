import * as fromResult from './result.actions';

describe('loadResults', () => {
  it('should return an action', () => {
    expect(fromResult.loadResults().type).toBe('[Result] Load Results');
  });
});
