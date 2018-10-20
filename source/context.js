import { createContext } from 'react';

export const { Provider, Consumer } = createContext({
  tryCall: (handler, ...args) => handler(...args),
  tryWrap: (handler) => (...args) => handler(...args),
});
