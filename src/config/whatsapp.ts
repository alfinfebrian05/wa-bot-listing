import dotenv from "dotenv";
import { create, Client, NotificationLanguage } from "@open-wa/wa-automate";
import { WhatsappConfig } from "@/types";

dotenv.config();

const whatsappConfig: WhatsappConfig = {
  sessionId: "whatsapp-bot",
  multiDevice: true,
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  useChrome: true,
  hostNotificationLang: 'en' as NotificationLanguage,
  logConsole: false,
  qrTimeout: 20,
  sessionDataPath: process.env.CLIENT_CONFIG_PATH || './whatsapp-session',
};


export const createWhatsappClient = async (): Promise<Client> => {
  try {
    const client = await create(whatsappConfig)
    return client
  } catch (error) {
    console.error('Error init WhatsApp client: ', error)
    throw error 
  }
}