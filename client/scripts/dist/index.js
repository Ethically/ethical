const root = '../../..';
const { getAppPrefix } = require(`${root}/helper/resolve`);
const { join } = require('path');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC9zY3JpcHRzL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyb290IiwiZ2V0QXBwUHJlZml4IiwicmVxdWlyZSIsImpvaW4iLCJyZWFkRmlsZVN5bmMiLCJSZWFjdCIsImFwcCIsInNjcmlwdFBhdGgiLCJpbml0U2NyaXB0IiwiYmVmb3JlU2NyaXB0Iiwic3RhdGUiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0SW5pdFNjcmlwdHMiLCJzY3JpcHROYW1lIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwic2NyaXB0IiwiYmVmb3JlIiwiX19odG1sIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsT0FBTyxVQUFiO0FBQ0EsTUFBTSxFQUFFQyxZQUFGLEtBQW1CQyxRQUFTLEdBQUVGLElBQUssaUJBQWhCLENBQXpCO0FBQ0EsTUFBTSxFQUFFRyxJQUFGLEtBQVdELFFBQVEsTUFBUixDQUFqQjtBQUNBLE1BQU0sRUFBRUUsWUFBRixLQUFtQkYsUUFBUSxJQUFSLENBQXpCO0FBQ0EsTUFBTUcsUUFBUUgsUUFBUSxPQUFSLENBQWQ7O0FBRUEsTUFBTUksTUFBTUwsY0FBWjtBQUNBLE1BQU1NLGFBQWEseUNBQW5CO0FBQ0EsTUFBTUMsYUFBYzs7O3VEQUdtQ0YsR0FBSTs7Q0FIM0Q7QUFNQSxNQUFNRyxlQUFnQkMsS0FBRCxJQUFhOzs7aUNBR0RDLEtBQUtDLFNBQUwsQ0FBZUYsS0FBZixDQUFzQjtDQUh2RDs7QUFNQSxNQUFNRyxpQkFBaUIsQ0FBQ0gsUUFBUSxFQUFULEtBQWdCO0FBQ25DLFVBQU1JLGFBQWEsQ0FBQ0MsUUFBUUMsR0FBUixDQUFZQyxRQUFaLElBQXdCLG9CQUF6QixJQUFpRCxLQUFwRTtBQUNBLFVBQU1DLFNBQVNYLGFBQWFPLFVBQTVCO0FBQ0EsVUFBTUssU0FBU1YsYUFBYUMsS0FBYixDQUFmO0FBQ0EsV0FBTyxDQUNILGdDQUFRLEtBQUksR0FBWixFQUFnQix5QkFBeUIsRUFBRVUsUUFBUUQsTUFBVixFQUF6QyxHQURHLEVBRUgsZ0NBQVEsS0FBSSxHQUFaLEVBQWdCLEtBQUtELE1BQXJCLEdBRkcsRUFHSCxnQ0FBUSxLQUFJLEdBQVosRUFBZ0IseUJBQXlCLEVBQUVFLFFBQVFaLFVBQVYsRUFBekMsR0FIRyxDQUFQO0FBS0gsQ0FURDs7QUFXQWEsT0FBT0MsT0FBUCxHQUFpQlQsY0FBakIiLCJmaWxlIjoidW5rbm93biIsInNvdXJjZVJvb3QiOiJub2RlX21vZHVsZXMvZXRoaWNhbCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHJvb3QgPSAnLi4vLi4vLi4nXG5jb25zdCB7IGdldEFwcFByZWZpeCB9ID0gcmVxdWlyZShgJHtyb290fS9oZWxwZXIvcmVzb2x2ZWApXG5jb25zdCB7IGpvaW4gfSA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgeyByZWFkRmlsZVN5bmMgfSA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKVxuXG5jb25zdCBhcHAgPSBnZXRBcHBQcmVmaXgoKVxuY29uc3Qgc2NyaXB0UGF0aCA9ICcvbm9kZV9tb2R1bGVzL2V0aGljYWwvY2xpZW50L2luaXQvZGlzdC8nXG5jb25zdCBpbml0U2NyaXB0ID0gYFxuICAgIHdpbmRvdy5yZXF1aXJlXG4gICAgICAgIC5sb2FkKClcbiAgICAgICAgLnRoZW4oKCkgPT4gc2V0VGltZW91dCgoKSA9PiB3aW5kb3cucmVxdWlyZSgnJHthcHB9JyksIDApKVxuICAgICAgICAuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKGUpKVxuYFxuY29uc3QgYmVmb3JlU2NyaXB0ID0gKHN0YXRlKSA9PiAoYFxuICAgIHdpbmRvdy5nbG9iYWwgPSB3aW5kb3dcbiAgICB3aW5kb3cucHJvY2VzcyA9IHsgZW52OiB7fSB9XG4gICAgd2luZG93LnN0YXRlID0gSlNPTi5wYXJzZSgnJHtKU09OLnN0cmluZ2lmeShzdGF0ZSl9JylcbmApXG5cbmNvbnN0IGdldEluaXRTY3JpcHRzID0gKHN0YXRlID0ge30pID0+IHtcbiAgICBjb25zdCBzY3JpcHROYW1lID0gKHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdOT0RFX0VOVl9VTkRFRklORUQnKSArICcuanMnXG4gICAgY29uc3Qgc2NyaXB0ID0gc2NyaXB0UGF0aCArIHNjcmlwdE5hbWVcbiAgICBjb25zdCBiZWZvcmUgPSBiZWZvcmVTY3JpcHQoc3RhdGUpXG4gICAgcmV0dXJuIFtcbiAgICAgICAgPHNjcmlwdCBrZXk9JzAnIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogYmVmb3JlIH19IC8+LFxuICAgICAgICA8c2NyaXB0IGtleT0nMScgc3JjPXtzY3JpcHR9IC8+LFxuICAgICAgICA8c2NyaXB0IGtleT0nMicgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBpbml0U2NyaXB0IH19IC8+XG4gICAgXVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEluaXRTY3JpcHRzXG4iXX0=