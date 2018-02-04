const root = '../../..';
const { getAppPrefix } = require(`${root}/helper/resolve`);
const { join } = require('path-browserify');
const { readFileSync } = require('fs');
const React = require('react');

const app = getAppPrefix();
const scriptPath = '/node_modules/ethical/client/init/dist/';
const initScript = `
    window.require
        .load()
        .then(() => window.require('${app}'))
        .then(() => console.log('Done requiring server rendered modules!'))
        .catch(e => console.error(e))
`;
const beforeScript = state => `
    window.global = window
    window.process = { env: {} }
    window.state = JSON.parse('${JSON.stringify(state)}')
`;

const getInitScripts = (state = {}) => {
    const scriptName = (process.env.NODE_ENV || 'NODE_ENV_UNDEFINED') + '.js';
    const script = scriptPath + scriptName;
    const before = beforeScript(state);
    return [React.createElement('script', { key: '0', dangerouslySetInnerHTML: { __html: before } }), React.createElement('script', { key: '1', src: script }), React.createElement('script', { key: '2', dangerouslySetInnerHTML: { __html: initScript } })];
};

module.exports = getInitScripts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC9zY3JpcHRzL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyb290IiwiZ2V0QXBwUHJlZml4IiwicmVxdWlyZSIsImpvaW4iLCJyZWFkRmlsZVN5bmMiLCJSZWFjdCIsImFwcCIsInNjcmlwdFBhdGgiLCJpbml0U2NyaXB0IiwiYmVmb3JlU2NyaXB0Iiwic3RhdGUiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0SW5pdFNjcmlwdHMiLCJzY3JpcHROYW1lIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwic2NyaXB0IiwiYmVmb3JlIiwiX19odG1sIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsT0FBTyxVQUFiO0FBQ0EsTUFBTSxFQUFFQyxZQUFGLEtBQW1CQyxRQUFTLEdBQUVGLElBQUssaUJBQWhCLENBQXpCO0FBQ0EsTUFBTSxFQUFFRyxJQUFGLEtBQVdELFFBQVEsaUJBQVIsQ0FBakI7QUFDQSxNQUFNLEVBQUVFLFlBQUYsS0FBbUJGLFFBQVEsSUFBUixDQUF6QjtBQUNBLE1BQU1HLFFBQVFILFFBQVEsT0FBUixDQUFkOztBQUVBLE1BQU1JLE1BQU1MLGNBQVo7QUFDQSxNQUFNTSxhQUFhLHlDQUFuQjtBQUNBLE1BQU1DLGFBQWM7OztzQ0FHa0JGLEdBQUk7OztDQUgxQztBQU9BLE1BQU1HLGVBQWdCQyxLQUFELElBQWE7OztpQ0FHREMsS0FBS0MsU0FBTCxDQUFlRixLQUFmLENBQXNCO0NBSHZEOztBQU1BLE1BQU1HLGlCQUFpQixDQUFDSCxRQUFRLEVBQVQsS0FBZ0I7QUFDbkMsVUFBTUksYUFBYSxDQUFDQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosSUFBd0Isb0JBQXpCLElBQWlELEtBQXBFO0FBQ0EsVUFBTUMsU0FBU1gsYUFBYU8sVUFBNUI7QUFDQSxVQUFNSyxTQUFTVixhQUFhQyxLQUFiLENBQWY7QUFDQSxXQUFPLENBQ0gsZ0NBQVEsS0FBSSxHQUFaLEVBQWdCLHlCQUF5QixFQUFFVSxRQUFRRCxNQUFWLEVBQXpDLEdBREcsRUFFSCxnQ0FBUSxLQUFJLEdBQVosRUFBZ0IsS0FBS0QsTUFBckIsR0FGRyxFQUdILGdDQUFRLEtBQUksR0FBWixFQUFnQix5QkFBeUIsRUFBRUUsUUFBUVosVUFBVixFQUF6QyxHQUhHLENBQVA7QUFLSCxDQVREOztBQVdBYSxPQUFPQyxPQUFQLEdBQWlCVCxjQUFqQiIsImZpbGUiOiJ1bmtub3duIiwic291cmNlUm9vdCI6Im5vZGVfbW9kdWxlcy9ldGhpY2FsIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgcm9vdCA9ICcuLi8uLi8uLidcbmNvbnN0IHsgZ2V0QXBwUHJlZml4IH0gPSByZXF1aXJlKGAke3Jvb3R9L2hlbHBlci9yZXNvbHZlYClcbmNvbnN0IHsgam9pbiB9ID0gcmVxdWlyZSgncGF0aC1icm93c2VyaWZ5JylcbmNvbnN0IHsgcmVhZEZpbGVTeW5jIH0gPSByZXF1aXJlKCdmcycpXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcblxuY29uc3QgYXBwID0gZ2V0QXBwUHJlZml4KClcbmNvbnN0IHNjcmlwdFBhdGggPSAnL25vZGVfbW9kdWxlcy9ldGhpY2FsL2NsaWVudC9pbml0L2Rpc3QvJ1xuY29uc3QgaW5pdFNjcmlwdCA9IGBcbiAgICB3aW5kb3cucmVxdWlyZVxuICAgICAgICAubG9hZCgpXG4gICAgICAgIC50aGVuKCgpID0+IHdpbmRvdy5yZXF1aXJlKCcke2FwcH0nKSlcbiAgICAgICAgLnRoZW4oKCkgPT4gY29uc29sZS5sb2coJ0RvbmUgcmVxdWlyaW5nIHNlcnZlciByZW5kZXJlZCBtb2R1bGVzIScpKVxuICAgICAgICAuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKGUpKVxuYFxuY29uc3QgYmVmb3JlU2NyaXB0ID0gKHN0YXRlKSA9PiAoYFxuICAgIHdpbmRvdy5nbG9iYWwgPSB3aW5kb3dcbiAgICB3aW5kb3cucHJvY2VzcyA9IHsgZW52OiB7fSB9XG4gICAgd2luZG93LnN0YXRlID0gSlNPTi5wYXJzZSgnJHtKU09OLnN0cmluZ2lmeShzdGF0ZSl9JylcbmApXG5cbmNvbnN0IGdldEluaXRTY3JpcHRzID0gKHN0YXRlID0ge30pID0+IHtcbiAgICBjb25zdCBzY3JpcHROYW1lID0gKHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdOT0RFX0VOVl9VTkRFRklORUQnKSArICcuanMnXG4gICAgY29uc3Qgc2NyaXB0ID0gc2NyaXB0UGF0aCArIHNjcmlwdE5hbWVcbiAgICBjb25zdCBiZWZvcmUgPSBiZWZvcmVTY3JpcHQoc3RhdGUpXG4gICAgcmV0dXJuIFtcbiAgICAgICAgPHNjcmlwdCBrZXk9JzAnIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogYmVmb3JlIH19IC8+LFxuICAgICAgICA8c2NyaXB0IGtleT0nMScgc3JjPXtzY3JpcHR9IC8+LFxuICAgICAgICA8c2NyaXB0IGtleT0nMicgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBpbml0U2NyaXB0IH19IC8+XG4gICAgXVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEluaXRTY3JpcHRzXG4iXX0=