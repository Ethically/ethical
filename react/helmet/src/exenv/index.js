const isNode = require('../../../../helper/is-node')

const canUseDOM = !!(
	typeof window !== 'undefined' &&
	window.document &&
	window.document.createElement &&
    !isNode()
)

const ExecutionEnvironment = {

	canUseDOM: canUseDOM,

	canUseWorkers: typeof Worker !== 'undefined',

	canUseEventListeners:
		canUseDOM && !!(window.addEventListener || window.attachEvent),

	canUseViewport: canUseDOM && !!window.screen

}

module.exports = ExecutionEnvironment
