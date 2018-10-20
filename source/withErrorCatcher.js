import React, { Component } from 'react';
import isFunction from '@actualwave/is-function';

import { Consumer } from './context';

const NO_WRAPS = {};

const withErrorCatcher = (WrappedComponent, wrapFnProps = true, displayName = '') => {
  class ErrorCatcherWrapper extends Component {
    wrapsMap = null;

    wraps = null;

    wrapsUpToDate = false;

    componentWillReceiveProps() {
      this.wrapsUpToDate = false;
    }

    createWraps(tryWrap) {
      const { props } = this;
      const wraps = {};
      const wrapsMap = new Map();

      /*
      Object.keys(props).forEach((key) => {
        const value = props[key];

        if (isFunction(value)) {
          const wrap = tryWrap(value);

          wraps[key] = wrap;
          wrapsMap.set(value);
        }
      });
      */

      for (const key in props) {
        if (props.hasOwnProperty(key)) {
          const value = props[key];

          if (isFunction(value)) {
            const wrap = tryWrap(value);

            wraps[key] = wrap;
            wrapsMap.set(value);
          }
        }
      }

      this.wraps = wraps;
      this.wrapsMap = wrapsMap;
    }

    areCallbacksChanged() {
      const { wrapsMap, props } = this;
      let count = 0;

      for (const key in props) {
        if (props.hasOwnProperty(key)) {
          const value = props[key];

          if (isFunction(value)) {
            if (wrapsMap.has(value)) {
              count++;
            } else {
              return true;
            }
          }
        }
      }

      return wrapsMap.size !== count;
    }

    childrenRenderer = (catcher) => {
      if (wrapFnProps && !this.wrapsUpToDate) {
        const { tryWrap } = catcher;

        if (!this.wrapsMap || this.areCallbacksChanged()) {
          this.createWraps(tryWrap);
        }
      }

      const wraps = this.wraps || NO_WRAPS;

      return <WrappedComponent {...this.props} {...wraps} {...catcher} />;
    };

    render() {
      return <Consumer>{this.childrenRenderer}</Consumer>;
    }
  }

  if (displayName) {
    ErrorCatcherWrapper.displayName = displayName;
  } else {
    const name = Component.displayName || Component.name || 'Component';

    ErrorCatcherWrapper.displayName = `withErrorCatcher(${name})`;
  }

  return ErrorCatcherWrapper;
};

export default withErrorCatcher;
