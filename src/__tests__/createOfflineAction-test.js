import { expect } from 'chai';
import { isFSA } from 'flux-standard-action';

import { createOfflineAction } from '../';

describe('createOfflineAction()', () => {
  describe('resulting action creator', () => {
    const type = 'TYPE';

    it('should throw an error if payloadCreator is not a function, undefined, null', () => {
      const wrongTypePayloadCreators = [1, false, 'string', {}, []];

      wrongTypePayloadCreators.forEach(wrongTypePayloadCreator => {
        expect(() => {
          createOfflineAction(type, wrongTypePayloadCreator);
        }).to.throw(
          Error,
          'Expected payloadCreator to be a function, undefined, or null'
        );
      });
    });

    it('uses identity function if payloadCreator is undefined', () => {
      const actionCreator = createOfflineAction(type, undefined);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          offline: {
            effect: foobar
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('uses identity function if payloadCreator is null', () => {
      const actionCreator = createOfflineAction(type, null);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          offline: {
            effect: foobar
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('should throw an error if effectCreator is not a function, undefined, null', () => {
      const wrongTypeEffectCreators = [1, false, 'string', []];

      wrongTypeEffectCreators.forEach(wrongTypeEffectCreator => {
        expect(() => {
          createOfflineAction(type, b => b, wrongTypeEffectCreator);
        }).to.throw(
          Error,
          'Expected effectCreator to be a function, prototype, undefined, or null'
        );
      });
    });

    it('uses identity function if effectCreator is undefined', () => {
      const actionCreator = createOfflineAction(type, b => b, undefined);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          offline: {
            effect: foobar
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('uses identity function if effectCreator is null', () => {
      const actionCreator = createOfflineAction(type, b => b, null);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          offline: {
            effect: foobar
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('uses the value when effectCreator is an object', () => {
      const effect = {bar: 'foo'};
      const actionCreator = createOfflineAction(type, b => b, effect);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          offline: {
            effect
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('should throw an error if commitAction is not a function, string, undefined, null', () => {
      const wrongTypeCommitActionCreators = [1, false, []];

      wrongTypeCommitActionCreators.forEach(wrongTypeCommitActionCreator => {
        expect(() => {
          createOfflineAction(type, b => b, b => b, wrongTypeCommitActionCreator);
        }).to.throw(
          Error,
          'Expected commitAction to be a function, string, undefined, or null'
        );
      });
    });

    it('passes in the value of the payload when commitAction is a function', () => {
      const actionCreator = createOfflineAction(type, b => b.foo, b => b, b => b);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar.foo,
        meta: {
          offline: {
            effect: foobar,
            commit: foobar.foo
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('creates a full action using the identity value if the commitAction is a string', () => {
      const actionCreator = createOfflineAction(type, b => b.foo, b => b, 'commit');
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar.foo,
        meta: {
          offline: {
            effect: foobar,
            commit: {type: 'commit', meta: foobar.foo}
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('should throw an error if rollbackAction is not a function, string, undefined, null', () => {
      const wrongTypeRollbackActionCreators = [1, false, []];

      wrongTypeRollbackActionCreators.forEach(wrongTypeRollbackActionCreator => {
        expect(() => {
          createOfflineAction(type, b => b, b => b, 'commit', wrongTypeRollbackActionCreator);
        }).to.throw(
          Error,
          'Expected rollbackAction to be a function, string, undefined, or null'
        );
      });
    });

    it('passes in the value of the payload when rollbackAction is a function', () => {
      const actionCreator = createOfflineAction(type, b => b.foo, b => b, 'commit', b => b);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar.foo,
        meta: {
          offline: {
            effect: foobar,
            commit: {type: 'commit', meta: foobar.foo },
            rollback: foobar.foo
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('creates a full action using the identity value if the rollbackAction is a string', () => {
      const actionCreator = createOfflineAction(type, b => b.foo, b => b, 'commit', 'rollback');
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar.foo,
        meta: {
          offline: {
            effect: foobar,
            commit: {type: 'commit', meta: foobar.foo},
            rollback: {type: 'rollback', meta: foobar.foo}
          }
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('sets error to true if payload is an Error object', () => {
      const actionCreator = createOfflineAction(type);
      const errObj = new TypeError('this is an error');

      const errAction = actionCreator(errObj);
      expect(errAction).to.deep.equal({
        type,
        payload: errObj,
        meta: {
          offline: {
            effect: errObj
          }
        },
        error: true
      });
      expect(isFSA(errAction)).to.be.true;
    });
  });
});
