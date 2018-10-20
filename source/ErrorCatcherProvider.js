import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider } from './context';

class ErrorCatcherProvider extends Component {
  static propTypes = {
    whenDidCatch: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(...init) {
    super(...init);

    const tryCall = (handler, args) => {
      try {
        return handler(...args);
      } catch (error) {
        this.componentDidCatch(error);
      }

      // TODO This will give some unexpected side effects, but on other side
      // not recoverable error was thrown. Should I throw new error here instead
      // of giving undefined? Needs testing.
      return undefined;
    };

    this.providerValue = {
      tryCall: (handler, ...args) => tryCall(handler, args),
      tryWrap: (handler) => (...args) => tryCall(handler, args),
    };
  }

  componentDidCatch(error, info) {
    this.props.whenDidCatch(error, info);
  }

  render() {
    return <Provider value={this.providerValue}>{this.props.children}</Provider>;
  }
}

export default ErrorCatcherProvider;
