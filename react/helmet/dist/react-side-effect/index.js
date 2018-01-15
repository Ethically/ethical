'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _exenv = require('../exenv');

var _exenv2 = _interopRequireDefault(_exenv);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function withSideEffect(reducePropsToState, handleStateChangeOnClient, mapStateOnServer) {
  if (typeof reducePropsToState !== 'function') {
    throw new Error('Expected reducePropsToState to be a function.');
  }
  if (typeof handleStateChangeOnClient !== 'function') {
    throw new Error('Expected handleStateChangeOnClient to be a function.');
  }
  if (typeof mapStateOnServer !== 'undefined' && typeof mapStateOnServer !== 'function') {
    throw new Error('Expected mapStateOnServer to either be undefined or a function.');
  }

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  return function wrap(WrappedComponent) {
    if (typeof WrappedComponent !== 'function') {
      throw new Error('Expected WrappedComponent to be a React component.');
    }

    var mountedInstances = [];
    var state = void 0;

    function emitChange() {
      state = reducePropsToState(mountedInstances.map(function (instance) {
        return instance.props;
      }));

      if (SideEffect.canUseDOM) {
        handleStateChangeOnClient(state);
      } else if (mapStateOnServer) {
        state = mapStateOnServer(state);
      }
    }

    var SideEffect = function (_Component) {
      _inherits(SideEffect, _Component);

      function SideEffect() {
        _classCallCheck(this, SideEffect);

        return _possibleConstructorReturn(this, (SideEffect.__proto__ || Object.getPrototypeOf(SideEffect)).apply(this, arguments));
      }

      _createClass(SideEffect, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
          return !(0, _shallowequal2.default)(nextProps, this.props);
        }
      }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
          mountedInstances.push(this);
          emitChange();
        }
      }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          emitChange();
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var index = mountedInstances.indexOf(this);
          mountedInstances.splice(index, 1);
          emitChange();
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, this.props);
        }
      }], [{
        key: 'peek',

        // Try to use displayName of wrapped component
        value: function peek() {
          return state;
        }

        // Expose canUseDOM so tests can monkeypatch it

      }, {
        key: 'rewind',
        value: function rewind() {
          if (SideEffect.canUseDOM) {
            throw new Error('You may only call rewind() on the server. Call peek() to read the current state.');
          }

          var recordedState = state;
          state = undefined;
          mountedInstances = [];
          return recordedState;
        }
      }]);

      return SideEffect;
    }(_react.Component);

    SideEffect.displayName = 'SideEffect(' + getDisplayName(WrappedComponent) + ')';
    SideEffect.canUseDOM = _exenv2.default.canUseDOM;


    return SideEffect;
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlYWN0L2hlbG1ldC9zcmMvcmVhY3Qtc2lkZS1lZmZlY3QvaW5kZXguanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIndpdGhTaWRlRWZmZWN0IiwicmVkdWNlUHJvcHNUb1N0YXRlIiwiaGFuZGxlU3RhdGVDaGFuZ2VPbkNsaWVudCIsIm1hcFN0YXRlT25TZXJ2ZXIiLCJFcnJvciIsImdldERpc3BsYXlOYW1lIiwiV3JhcHBlZENvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwibmFtZSIsIndyYXAiLCJtb3VudGVkSW5zdGFuY2VzIiwic3RhdGUiLCJlbWl0Q2hhbmdlIiwibWFwIiwiaW5zdGFuY2UiLCJwcm9wcyIsIlNpZGVFZmZlY3QiLCJjYW5Vc2VET00iLCJuZXh0UHJvcHMiLCJwdXNoIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwicmVjb3JkZWRTdGF0ZSIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUFBLE9BQU9DLE9BQVAsR0FBaUIsU0FBU0MsY0FBVCxDQUNmQyxrQkFEZSxFQUVmQyx5QkFGZSxFQUdmQyxnQkFIZSxFQUlmO0FBQ0EsTUFBSSxPQUFPRixrQkFBUCxLQUE4QixVQUFsQyxFQUE4QztBQUM1QyxVQUFNLElBQUlHLEtBQUosQ0FBVSwrQ0FBVixDQUFOO0FBQ0Q7QUFDRCxNQUFJLE9BQU9GLHlCQUFQLEtBQXFDLFVBQXpDLEVBQXFEO0FBQ25ELFVBQU0sSUFBSUUsS0FBSixDQUFVLHNEQUFWLENBQU47QUFDRDtBQUNELE1BQUksT0FBT0QsZ0JBQVAsS0FBNEIsV0FBNUIsSUFBMkMsT0FBT0EsZ0JBQVAsS0FBNEIsVUFBM0UsRUFBdUY7QUFDdEYsVUFBTSxJQUFJQyxLQUFKLENBQVUsaUVBQVYsQ0FBTjtBQUNBOztBQUVELFdBQVNDLGNBQVQsQ0FBd0JDLGdCQUF4QixFQUEwQztBQUN4QyxXQUFPQSxpQkFBaUJDLFdBQWpCLElBQWdDRCxpQkFBaUJFLElBQWpELElBQXlELFdBQWhFO0FBQ0Q7O0FBRUQsU0FBTyxTQUFTQyxJQUFULENBQWNILGdCQUFkLEVBQWdDO0FBQ3JDLFFBQUksT0FBT0EsZ0JBQVAsS0FBNEIsVUFBaEMsRUFBNEM7QUFDMUMsWUFBTSxJQUFJRixLQUFKLENBQVUsb0RBQVYsQ0FBTjtBQUNEOztBQUVELFFBQUlNLG1CQUFtQixFQUF2QjtBQUNBLFFBQUlDLGNBQUo7O0FBRUEsYUFBU0MsVUFBVCxHQUFzQjtBQUNwQkQsY0FBUVYsbUJBQW1CUyxpQkFBaUJHLEdBQWpCLENBQXFCLFVBQVVDLFFBQVYsRUFBb0I7QUFDbEUsZUFBT0EsU0FBU0MsS0FBaEI7QUFDRCxPQUYwQixDQUFuQixDQUFSOztBQUlBLFVBQUlDLFdBQVdDLFNBQWYsRUFBMEI7QUFDeEJmLGtDQUEwQlMsS0FBMUI7QUFDRCxPQUZELE1BRU8sSUFBSVIsZ0JBQUosRUFBc0I7QUFDM0JRLGdCQUFRUixpQkFBaUJRLEtBQWpCLENBQVI7QUFDRDtBQUNGOztBQWxCb0MsUUFvQi9CSyxVQXBCK0I7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDhDQTBDYkUsU0ExQ2EsRUEwQ0Y7QUFDL0IsaUJBQU8sQ0FBQyw0QkFBYUEsU0FBYixFQUF3QixLQUFLSCxLQUE3QixDQUFSO0FBQ0Q7QUE1Q2tDO0FBQUE7QUFBQSw2Q0E4Q2Q7QUFDbkJMLDJCQUFpQlMsSUFBakIsQ0FBc0IsSUFBdEI7QUFDQVA7QUFDRDtBQWpEa0M7QUFBQTtBQUFBLDZDQW1EZDtBQUNuQkE7QUFDRDtBQXJEa0M7QUFBQTtBQUFBLCtDQXVEWjtBQUNyQixjQUFNUSxRQUFRVixpQkFBaUJXLE9BQWpCLENBQXlCLElBQXpCLENBQWQ7QUFDQVgsMkJBQWlCWSxNQUFqQixDQUF3QkYsS0FBeEIsRUFBK0IsQ0FBL0I7QUFDQVI7QUFDRDtBQTNEa0M7QUFBQTtBQUFBLGlDQTZEMUI7QUFDUCxpQkFBTyw4QkFBQyxnQkFBRCxFQUFzQixLQUFLRyxLQUEzQixDQUFQO0FBQ0Q7QUEvRGtDO0FBQUE7O0FBcUJuQztBQXJCbUMsK0JBMkJyQjtBQUNaLGlCQUFPSixLQUFQO0FBQ0Q7O0FBTEQ7O0FBeEJtQztBQUFBO0FBQUEsaUNBK0JuQjtBQUNkLGNBQUlLLFdBQVdDLFNBQWYsRUFBMEI7QUFDeEIsa0JBQU0sSUFBSWIsS0FBSixDQUFVLGtGQUFWLENBQU47QUFDRDs7QUFFRCxjQUFJbUIsZ0JBQWdCWixLQUFwQjtBQUNBQSxrQkFBUWEsU0FBUjtBQUNBZCw2QkFBbUIsRUFBbkI7QUFDQSxpQkFBT2EsYUFBUDtBQUNEO0FBeENrQzs7QUFBQTtBQUFBOztBQW9CL0JQLGNBcEIrQixDQXNCNUJULFdBdEI0QixtQkFzQkFGLGVBQWVDLGdCQUFmLENBdEJBO0FBb0IvQlUsY0FwQitCLENBeUI1QkMsU0F6QjRCLEdBeUJoQixnQkFBcUJBLFNBekJMOzs7QUFrRXJDLFdBQU9ELFVBQVA7QUFDRCxHQW5FRDtBQW9FRCxDQXZGRCIsImZpbGUiOiJ1bmtub3duIiwic291cmNlUm9vdCI6Im5vZGVfbW9kdWxlcy9ldGhpY2FsIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBFeGVjdXRpb25FbnZpcm9ubWVudCBmcm9tICcuLi9leGVudic7XG5pbXBvcnQgc2hhbGxvd0VxdWFsIGZyb20gJ3NoYWxsb3dlcXVhbCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2l0aFNpZGVFZmZlY3QoXG4gIHJlZHVjZVByb3BzVG9TdGF0ZSxcbiAgaGFuZGxlU3RhdGVDaGFuZ2VPbkNsaWVudCxcbiAgbWFwU3RhdGVPblNlcnZlclxuKSB7XG4gIGlmICh0eXBlb2YgcmVkdWNlUHJvcHNUb1N0YXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCByZWR1Y2VQcm9wc1RvU3RhdGUgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuICBpZiAodHlwZW9mIGhhbmRsZVN0YXRlQ2hhbmdlT25DbGllbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGhhbmRsZVN0YXRlQ2hhbmdlT25DbGllbnQgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuICBpZiAodHlwZW9mIG1hcFN0YXRlT25TZXJ2ZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtYXBTdGF0ZU9uU2VydmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG1hcFN0YXRlT25TZXJ2ZXIgdG8gZWl0aGVyIGJlIHVuZGVmaW5lZCBvciBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGlzcGxheU5hbWUoV3JhcHBlZENvbXBvbmVudCkge1xuICAgIHJldHVybiBXcmFwcGVkQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IFdyYXBwZWRDb21wb25lbnQubmFtZSB8fCAnQ29tcG9uZW50JztcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKFdyYXBwZWRDb21wb25lbnQpIHtcbiAgICBpZiAodHlwZW9mIFdyYXBwZWRDb21wb25lbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgV3JhcHBlZENvbXBvbmVudCB0byBiZSBhIFJlYWN0IGNvbXBvbmVudC4nKTtcbiAgICB9XG5cbiAgICBsZXQgbW91bnRlZEluc3RhbmNlcyA9IFtdO1xuICAgIGxldCBzdGF0ZTtcblxuICAgIGZ1bmN0aW9uIGVtaXRDaGFuZ2UoKSB7XG4gICAgICBzdGF0ZSA9IHJlZHVjZVByb3BzVG9TdGF0ZShtb3VudGVkSW5zdGFuY2VzLm1hcChmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLnByb3BzO1xuICAgICAgfSkpO1xuXG4gICAgICBpZiAoU2lkZUVmZmVjdC5jYW5Vc2VET00pIHtcbiAgICAgICAgaGFuZGxlU3RhdGVDaGFuZ2VPbkNsaWVudChzdGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKG1hcFN0YXRlT25TZXJ2ZXIpIHtcbiAgICAgICAgc3RhdGUgPSBtYXBTdGF0ZU9uU2VydmVyKHN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBTaWRlRWZmZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAgIC8vIFRyeSB0byB1c2UgZGlzcGxheU5hbWUgb2Ygd3JhcHBlZCBjb21wb25lbnRcbiAgICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9IGBTaWRlRWZmZWN0KCR7Z2V0RGlzcGxheU5hbWUoV3JhcHBlZENvbXBvbmVudCl9KWA7XG5cbiAgICAgIC8vIEV4cG9zZSBjYW5Vc2VET00gc28gdGVzdHMgY2FuIG1vbmtleXBhdGNoIGl0XG4gICAgICBzdGF0aWMgY2FuVXNlRE9NID0gRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NO1xuXG4gICAgICBzdGF0aWMgcGVlaygpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgcmV3aW5kKCkge1xuICAgICAgICBpZiAoU2lkZUVmZmVjdC5jYW5Vc2VET00pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtYXkgb25seSBjYWxsIHJld2luZCgpIG9uIHRoZSBzZXJ2ZXIuIENhbGwgcGVlaygpIHRvIHJlYWQgdGhlIGN1cnJlbnQgc3RhdGUuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVjb3JkZWRTdGF0ZSA9IHN0YXRlO1xuICAgICAgICBzdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbW91bnRlZEluc3RhbmNlcyA9IFtdO1xuICAgICAgICByZXR1cm4gcmVjb3JkZWRTdGF0ZTtcbiAgICAgIH1cblxuICAgICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xuICAgICAgICByZXR1cm4gIXNoYWxsb3dFcXVhbChuZXh0UHJvcHMsIHRoaXMucHJvcHMpO1xuICAgICAgfVxuXG4gICAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgIG1vdW50ZWRJbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgICAgICAgZW1pdENoYW5nZSgpO1xuICAgICAgfVxuXG4gICAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICAgIGVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gbW91bnRlZEluc3RhbmNlcy5pbmRleE9mKHRoaXMpO1xuICAgICAgICBtb3VudGVkSW5zdGFuY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGVtaXRDaGFuZ2UoKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPFdyYXBwZWRDb21wb25lbnQgey4uLnRoaXMucHJvcHN9IC8+O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBTaWRlRWZmZWN0O1xuICB9XG59XG4iXX0=