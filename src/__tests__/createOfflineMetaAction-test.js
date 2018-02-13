import { expect } from 'chai';
import { isFSA } from 'flux-standard-action';

import { createOfflineMetaAction } from '../';

describe('createOfflineMetaAction()', () => {
  describe('resulting action creator', () => {
    const type = 'TYPE';

    it('returns a valid FSA', () => {
      const actionCreator = createOfflineMetaAction(type, b => b);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(isFSA(action)).to.be.true;
    });

    it('uses return value as meta', () => {
      const actionCreator = createOfflineMetaAction(type, b => b);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        meta: foobar
      });
    });

    it('should throw an error if metaCreator is not a function, undefined, null', () => {
      const wrongTypeMetaCreators = [1, false, 'string', {}, []];

      wrongTypeMetaCreators.forEach(wrongTypeMetaCreator => {
        expect(() => {
          createOfflineMetaAction(type, wrongTypeMetaCreator);
        }).to.throw(
          Error,
          'Expected metaCreator to be a function, undefined or null'
        );
      });
    });

    it('uses identity function if metaCreator is undefined', () => {
      const actionCreator = createOfflineMetaAction(type);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        meta: foobar
      });
      expect(isFSA(action)).to.be.true;
    });

    it('uses identity function if metaCreator is null', () => {
      const actionCreator = createOfflineMetaAction(type, null);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        meta: foobar
      });
      expect(isFSA(action)).to.be.true;
    });

    it('sets error to true if arg is an Error object', () => {
      const actionCreator = createOfflineMetaAction(type);
      const errObj = new TypeError('this is an error');

      const errAction = actionCreator(errObj);
      expect(errAction).to.deep.equal({
        type,
        meta: errObj,
        error: true
      });
      expect(isFSA(errAction)).to.be.true;
    });

    it('sets meta only when defined', () => {
      const action = createOfflineMetaAction(type)();
      expect(action).to.deep.equal({
        type
      });

      const explictUndefinedAction = createOfflineMetaAction(type)(undefined);
      expect(explictUndefinedAction).to.deep.equal({
        type
      });
    });
  });
});
