const isNode = () => {
    return !! (
        typeof process !== 'undefined' &&
        process.versions &&
        process.versions.node
    )
}

module.exports = isNode
