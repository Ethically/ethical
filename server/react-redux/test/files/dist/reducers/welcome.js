'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const welcome = (state = null, action) => {
    switch (action.type) {
        case 'SET_GREETING':
            return action.payload;
        default:
            return state;
    }
};

exports.default = welcome;
//# sourceMappingURL=welcome.js.map