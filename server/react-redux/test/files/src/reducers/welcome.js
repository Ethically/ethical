const welcome = (state = null, action) => {
    switch (action.type) {
        case 'SET_GREETING':
            return action.payload
        default:
            return state
    }
}

export default welcome
