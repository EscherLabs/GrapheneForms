forman.prototype.events = (function (_) {
  'use strict';

  // keys are event names
  var handlers = {};
  var events = {};

  events.on = function (event, handler) {
    if (typeof handlers[event] !== 'object') {
      handlers[event] = [];
    }

    handlers[event].push(handler);
  };

  events.off = function (event, handler) {
    var index = _.indexOf(handlers[event], handler);

    if (index === -1) {
      console.warn('Handler not found for event ' + event +
        ':', handler);
    } else {
      handlers[event].splice(index, 1);
    }
  };

  events.trigger = function (event) {
    var args = Array.prototype.slice.call(arguments, 1);

    _.each(handlers[event], function (handler) {
      handler.apply(events, args);
    });
  };

  events.debounce = function (event, handler) {
    events.on(event, _.debounce(handler, 250));
  };

  return events;
}(_));