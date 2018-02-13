import identity from 'lodash/identity';
import invariant from 'invariant';

export default function createOfflineMetaAction(type, metaCreator = identity) {
  invariant(
    typeof metaCreator === 'function' || metaCreator === null,
    'Expected metaCreator to be a function, undefined or null'
  );

  let finalMetaCreator = metaCreator;
  if (metaCreator === null) {
    finalMetaCreator = identity;
  } else if (finalMetaCreator !== identity) {
    finalMetaCreator = (head, ...args) => (
      head instanceof Error ? head : metaCreator(head, ...args)
    );
  }

  const typeString = type.toString();

  const actionCreator = (...args) => {
    const meta = finalMetaCreator(...args);
    const action = { type };

    if (meta instanceof Error) {
      action.error = true;
    }

    if (meta !== undefined) {
      action.meta = meta;
    }

    return action;
  };

  actionCreator.toString = () => typeString;

  return actionCreator;
}
