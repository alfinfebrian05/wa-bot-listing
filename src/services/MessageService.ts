import { MessageHandler } from '@/types';
import { ChatId, Client, Message } from '@open-wa/wa-automate';

export class MessageService {
    private readonly welcomedUsers: Set<ChatId> = new Set<ChatId>()

    constructor(private readonly whatsappClient: Client) {}

    private messageHandlers: Record<string, MessageHandler> = {
        'hi bot listing': this.sendListingMenu.bind(this),
    }

    public async handleMessageIncoming(message: Message): Promise<void> {
        const { body } = message;

        const normalized = body.toLowerCase();
        const triggerTexts = ['hi', 'halo', 'hi bot', 'halo bot']

        const recognized = triggerTexts.includes(normalized)
        const menuChosen = Object.keys(this.messageHandlers).find((k) => normalized.includes(k));
        
        if(menuChosen) {
            await this.messageHandlers[menuChosen](message)
            return;
        }
        
        if(recognized) {
            await this.sendWelcomeMessage(message)
            return;
        }

        await this.sendUndefined(message)
    }

    public async handleWelcomeMessage(message: Message): Promise<void> {
        const { from } = message;
        
        if(message.isGroupMsg) return;

        if(this.welcomedUsers.has(from)) return

        if(!this.welcomedUsers.has(from)) {
            this.welcomedUsers.add(from)
            await this.sendWelcomeMessage(message)
        }
    }

    private async sendWelcomeMessage(message: Message): Promise<void> {
        const { from, notifyName } = message;
        
        const welcomeMessage = `Selamat datang ${notifyName} di bot listing property 🏡❗\n\n` +
            `Silahkan ketik 'Hi Bot Listing' untuk melihat menu utama.`;
        
        await this.whatsappClient.sendText(from, welcomeMessage);
    }

    private async sendUndefined(message: Message) {
        const { from } = message;
        await this.whatsappClient.sendText(from, 'Maaf, saya tidak mengerti pesan anda 😅');
    }

    private async sendListingMenu(message: Message): Promise<void> {
        const { from, notifyName } = message;
        
        const menu = `Hai ${notifyName}👋 ingin melakukan apa hari ini?\n\n` +
            `1. Simpan Listing\n` +
            `2. Lihat semua listing saya\n` +
            `3. Kirim lokasi listing berdasarkan listing id\n\n` +
            `Balas dengan angka sesuai menu yang diinginkan, contoh: ketik '1' lalu kirim.`;
        
        try {
            await this.whatsappClient.sendText(from, menu)
        } catch (error) {
            console.error('Failed send listing menu : ', error)
        }
    }
}