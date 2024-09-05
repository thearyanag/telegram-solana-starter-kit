interface TelegramWebApp {
  WebApp: {
    MainButton: {
      text: string;
      isVisible: boolean;
      setText(text: string): void;
      onClick(callback: () => void): void;
      show(): void;
    };
    onEvent(eventType: string, callback: () => void): void;
    showAlert(message: string): void;
    close(): void;
    initDataUnsafe?: {
      user: {
        id: number;
        first_name: string;
      };
    };
  };

}

interface Window {
  Telegram?: TelegramWebApp;
}

declare global {
  interface Window {
    Telegram?: TelegramWebApp;
  }
}

// export { TelegramWebApp };
