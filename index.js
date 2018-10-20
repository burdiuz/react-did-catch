'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var isFunction = _interopDefault(require('@actualwave/is-function'));

const {
  Provider,
  Consumer
} = React.createContext({
  tryCall: (handler, ...args) => handler(...args),
  tryWrap: handler => (...args) => handler(...args)
});

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

class ErrorCatcherProvider extends React.Component {
  constructor(...init) {
    super(...init);

    const tryCall = (handler, args) => {
      try {
        return handler(...args);
      } catch (error) {
        this.componentDidCatch(error);
      } // TODO This will give some unexpected side effects, but on other side
      // not recoverable error was thrown. Should I throw new error here instead
      // of giving undefined? Needs testing.


      return undefined;
    };

    this.providerValue = {
      tryCall: (handler, ...args) => tryCall(handler, args),
      tryWrap: handler => (...args) => tryCall(handler, args)
    };
  }

  componentDidCatch(error, info) {
    this.props.whenDidCatch(error, info);
  }

  render() {
    return React__default.createElement(Provider, {
      value: this.providerValue
    }, this.props.children);
  }

}

_defineProperty(ErrorCatcherProvider, "propTypes", {
  whenDidCatch: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
});

const NO_WRAPS = {};

const withErrorCatcher = (WrappedComponent, wrapFnProps = true, displayName = '') => {
  class ErrorCatcherWrapper extends React.Component {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "wrapsMap", null);

      _defineProperty(this, "wraps", null);

      _defineProperty(this, "wrapsUpToDate", false);

      _defineProperty(this, "childrenRenderer", catcher => {
        if (wrapFnProps && !this.wrapsUpToDate) {
          const {
            tryWrap
          } = catcher;

          if (!this.wrapsMap || this.areCallbacksChanged()) {
            this.createWraps(tryWrap);
          }
        }

        const wraps = this.wraps || NO_WRAPS;
        return React__default.createElement(WrappedComponent, _extends({}, this.props, wraps, catcher));
      });
    }

    componentWillReceiveProps() {
      this.wrapsUpToDate = false;
    }

    createWraps(tryWrap) {
      const {
        props
      } = this;
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
      const {
        wrapsMap,
        props
      } = this;
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

    render() {
      return React__default.createElement(Consumer, null, this.childrenRenderer);
    }

  }

  if (displayName) {
    ErrorCatcherWrapper.displayName = displayName;
  } else {
    const name = React.Component.displayName || React.Component.name || 'Component';
    ErrorCatcherWrapper.displayName = `withErrorCatcher(${name})`;
  }

  return ErrorCatcherWrapper;
};

exports.ErrorCatcherProvider = ErrorCatcherProvider;
exports.ErrorCatcherConsumer = Consumer;
exports.withErrorCatcher = withErrorCatcher;
//# sourceMappingURL=index.js.map
