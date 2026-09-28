import test from 'node:test';
import assert from 'node:assert/strict';
import { canDeleteMessage, deleteMessage, DELETE_WINDOW_MS, DELETED_MESSAGE } from '../src/features/chats/messageDeletion.js';

test('only own timestamped messages are deletable within five minutes', () => {
  const message = { me: true, sentAt: 1000 };
  assert.equal(canDeleteMessage(message, 1000), true);
  assert.equal(canDeleteMessage(message, 1000 + DELETE_WINDOW_MS - 1), true);
  assert.equal(canDeleteMessage(message, 1000 + DELETE_WINDOW_MS), false);
  assert.equal(canDeleteMessage(message, 999), false);
  assert.equal(canDeleteMessage({ ...message, me: false }, 1000), false);
  assert.equal(canDeleteMessage({ me: true }, 1000), false);
});

test('deletion keeps a tombstone and original time and removes attachments', () => {
  const message = { me: true, sentAt: 1000, at: '10:30 AM', t: 'Private draft', attachments: [] };
  assert.equal(deleteMessage(message, 2000), true);
  assert.equal(message.t, DELETED_MESSAGE);
  assert.equal(message.at, '10:30 AM');
  assert.deepEqual(message.attachments, []);
  assert.equal(deleteMessage(message, 2001), false);
});

test('expired deletion leaves the message unchanged', () => {
  const message = { me: true, sentAt: 1000, t: 'Keep this' };
  assert.equal(deleteMessage(message, 1000 + DELETE_WINDOW_MS), false);
  assert.equal(message.t, 'Keep this');
});
