import identity from 'lodash/identity';
import invariant from 'invariant';

import createOfflineMetaAction from './createOfflineMetaAction';

export default (
  type, payloadCreator = identity, effectCreator = identity, commitAction = null,
  rollbackAction = null
) => {
  invariant(
    typeof payloadCreator === 'function' || payloadCreator === null,
    'Expected payloadCreator to be a function, undefined, or null'
  );

  invariant(
    typeof effectCreator === 'function' ||
    (typeof effectCreator === 'object' && !Array.isArray(effectCreator)) ||
    effectCreator === null,
    'Expected effectCreator to be a function, prototype, undefined, or null'
  );

  invariant(
    typeof commitAction === 'function' || typeof commitAction === 'string' || commitAction === null,
    'Expected commitAction to be a function, string, undefined, or null'
  );

  invariant(
    typeof rollbackAction === 'function' || typeof rollbackAction === 'string' || rollbackAction === null,
    'Expected rollbackAction to be a function, string, undefined, or null'
  );

  let finalPayloadCreator = payloadCreator || identity;
  if (finalPayloadCreator === null) {
    finalPayloadCreator = identity;
  } else if (finalPayloadCreator !== identity) {
    finalPayloadCreator = (head, ...args) => (
      head instanceof Error ? head : payloadCreator(head, ...args)
    );
  }

  let finalEffectCreator = effectCreator || identity;
  if (effectCreator === null) {
    finalEffectCreator = identity;
  } else if (effectCreator !== identity) {
    if (typeof effectCreator === 'function') {
      finalEffectCreator = (head, ...args) => (
        head instanceof Error ? head : effectCreator(head, ...args)
      );
    } else {
      finalEffectCreator = () => effectCreator;
    }
  }

  let finalCommitActionCreator = commitAction;
  if (typeof finalCommitActionCreator === 'string') {
    finalCommitActionCreator = createOfflineMetaAction(finalCommitActionCreator, identity);
  }

  let finalRollbackActionCreator = rollbackAction;
  if (typeof finalRollbackActionCreator === 'string') {
    finalRollbackActionCreator = createOfflineMetaAction(finalRollbackActionCreator, identity);
  }

  const typeString = type.toString();
  const actionCreator = (...args) => {
    const payload = finalPayloadCreator(...args);
    const effect = finalEffectCreator(...args);
    const action = { type };

    if (payload instanceof Error) {
      action.error = true;
    }

    if (payload !== undefined) {
      action.payload = payload;
    }

    if (effect !== undefined) {
      const offline = {
        effect
      };

      if (typeof finalCommitActionCreator !== 'undefined' && finalCommitActionCreator !== null) {
        offline.commit = finalCommitActionCreator(payload);
      }

      if (typeof finalRollbackActionCreator !== 'undefined' && finalRollbackActionCreator !== null) {
        offline.rollback = finalRollbackActionCreator(payload);
      }

      action.meta = {
        offline
      };
    }

    return action;
  };

  actionCreator.toString = () => typeString;

  return actionCreator;
};
