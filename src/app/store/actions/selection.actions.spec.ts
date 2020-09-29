import * as fromSelection from './selection.actions';

describe('loadSelections', () => {
  it('should return an action', () => {
    expect(fromSelection.loadSelections().type).toBe('[Selection] Load Selections');
  });
});
