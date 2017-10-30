import { babel } from '../../package.json'

const { env: { test: config } } = babel

config.babelrc = false
config.plugins = config.plugins.slice(2)
config.exclude = 'node_modules/**'
config.presets[0][1].modules = false

export default config
