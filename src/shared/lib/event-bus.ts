type EventCallback = (...args: any[]) => void;

const createEventBus = () => {
  const events: Record<string, EventCallback[]> = {};

  // Event subscribe qilish
  const subscribe = (event: string, callback: EventCallback): (() => void) => {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);

    // Unsubscribe funksiyasi
    return () => {
      events[event] = events[event].filter((cb) => cb !== callback);
    };
  };

  // Event emit qilish
  const emit = (event: string, ...args: any[]): void => {
    if (events[event]) {
      events[event].forEach((callback) => callback(...args));
    }
  };

  return {
    subscribe,
    emit,
  };
};

export const eventBus = createEventBus();
