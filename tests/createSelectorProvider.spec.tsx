import test from 'ava';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { createSelectorProvider } from '../src';

test('creates a react component', t => {
  const context = React.createContext('default_value');
  const Provider = createSelectorProvider(context);
  const wrapper = shallow(
    <Provider value="test_value">
      <div />
    </Provider>
  );

  t.truthy(wrapper);
});

test('context still can be consumed using original Consumer', t => {
  const context = React.createContext('default_value');
  const Provider = createSelectorProvider(context);
  const value = 'test_value';

  const wrapper = mount(
    <Provider value={value}>
      <context.Consumer>
        {r => <div className="test">{r}</div>}
      </context.Consumer>
    </Provider>
  );

  t.is(wrapper.find('.test').text(), value);
});
