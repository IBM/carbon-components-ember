let registerWaiter;
let unregisterWaiter;
let _impl;
let testingNotAvailableMessage = () => {
  throw new Error('Attempted to use test utilities, but `ember-testing` was not included');
};
registerWaiter = testingNotAvailableMessage;
unregisterWaiter = testingNotAvailableMessage;
function registerTestImplementation(impl) {
  let {
    Test
  } = impl;
  registerWaiter = Test.registerWaiter;
  unregisterWaiter = Test.unregisterWaiter;
  _impl = impl;
}

export { _impl, registerTestImplementation, registerWaiter, unregisterWaiter };
