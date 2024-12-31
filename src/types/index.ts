import { Message, NotificationLanguage } from "@open-wa/wa-automate";

export interface WhatsappConfig {
    sessionId: string;
    multiDevice: boolean;
    authTimeout: number;
    blockCrashLogs: boolean;
    useChrome: boolean;
    disableSpins: boolean;
    headless: boolean;
    hostNotificationLang?: NotificationLanguage;
    logConsole: boolean;
    qrTimeout: number;
    sessionDataPath: string;
}

export type MessageHandler = (message: Message) => Promise<void>