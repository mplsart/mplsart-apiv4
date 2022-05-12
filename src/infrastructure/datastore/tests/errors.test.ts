/* eslint-env jest */

import * as exceptions from '../errors';

test('InvalidDatastoreKey is a subclass of Error', () => {
  const msg = 'A Rest Error Occurred';
  expect(() => {
    throw new exceptions.InvalidDatastoreKey(msg);
  }).toThrow(Error);
});

test('InvalidResourceId contains expected message', () => {
  const msg = 'This request is bad.';
  try {
    throw new exceptions.InvalidResourceId(msg);
  } catch (e) {
    const err = e as Error;
    expect(err.message).toBe(msg);
  }
});

test('UnexpectedDatastoreKind contains expected message', () => {
  const msg = 'Bad Datastore Kind.';

  try {
    throw new exceptions.UnexpectedDatastoreKind(msg);
  } catch (e) {
    const err = e as Error;
    expect(err.message).toBe(msg);
  }
});
