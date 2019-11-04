import test from 'ava';
import { mount } from 'enzyme';
import React from 'react';
import { createSelectorProvider, useContextSelector } from '../src';

interface TestContext {
  readonly [s: string]: number | string;
}

const context = React.createContext<TestContext>({});

const TestComponent = ({
  keyToSubscribe
}: {
  readonly keyToSubscribe: string;
}) => {
  const value = useContextSelector(context, c => c[keyToSubscribe]);
  return (
    <div className={keyToSubscribe}>
      <div className="random">{Math.random()}</div>
      <div className="value">{value}</div>
    </div>
  );
};

test('accesses subscribed value', t => {
  const Provider = createSelectorProvider(context);
  const subscribedValue = 'subscribed value';
  const wrapper = mount(
    <Provider value={{ subscribedValue }}>
      <TestComponent keyToSubscribe="subscribedValue" />
    </Provider>
  );

  t.is(wrapper.find('.subscribedValue .value').text(), subscribedValue);
});

test('only rerenders if the subscribed value change', t => {
  const Provider = createSelectorProvider(context);
  const wrapper = mount(
    <Provider value={{ first: 1, second: 2 }}>
      <TestComponent keyToSubscribe="first" />
      <TestComponent keyToSubscribe="second" />
    </Provider>
  );

  const initialFirstRandomNumber = wrapper.find('.first .random').text();
  const initialSecondRandomNumber = wrapper.find('.second .random').text();

  t.is(wrapper.find('.first .value').text(), '1');
  t.is(wrapper.find('.second .value').text(), '2');

  wrapper.setProps({
    value: { first: 1, second: 5 }
  });

  t.is(wrapper.find('.first .value').text(), '1');
  t.is(wrapper.find('.second .value').text(), '5');

  t.is(wrapper.find('.first .random').text(), initialFirstRandomNumber);
  t.not(wrapper.find('.second .random').text(), initialSecondRandomNumber);
});
