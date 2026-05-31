const CHANNEL_NAME = "dual-presentation-sync-v1";

export function createSyncChannel(onMessage) {
  const channel = new BroadcastChannel(CHANNEL_NAME);

  channel.onmessage = (event) => {
    const data = event.data;
    if (!data || !data.type) return;
    onMessage(data);
  };

  function broadcast(type, payload = {}) {
    const message = { type, ...payload, sentAt: Date.now() };
    channel.postMessage(message);
  }

  return { broadcast };
}
