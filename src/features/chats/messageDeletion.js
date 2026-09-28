export const DELETE_WINDOW_MS = 5 * 60 * 1000;
export const DELETED_MESSAGE = 'This message was deleted';

export function canDeleteMessage(message, time = Date.now()) {
  return Boolean(message?.me && !message.deleted && Number.isFinite(message.sentAt)
    && time >= message.sentAt && time - message.sentAt < DELETE_WINDOW_MS);
}

export function deleteMessage(message, time = Date.now()) {
  if (!canDeleteMessage(message, time)) return false;
  for (const file of message.attachments || []) URL.revokeObjectURL(file.url);
  message.attachments = [];
  message.t = DELETED_MESSAGE;
  message.deleted = true;
  delete message.fresh;
  return true;
}
