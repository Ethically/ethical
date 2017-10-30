import React from 'react'
import { shallow } from 'enzyme'
import Root from '../../src/index.js'

describe('<Root />', () => {
    it('should wrap component in a div', () => {
        const wrapper = shallow(<Root><div>Hello</div></Root>)
        const html = '<ethical-react-root><div>Hello</div></ethical-react-root>'
        expect(wrapper.html()).toBe(html)
    })
})
