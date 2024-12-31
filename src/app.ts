import 'module-alias/register';
import express from 'express';
import dotenv from 'dotenv';
import { Client } from '@open-wa/wa-automate';
import { MessageController } from '@/controllers/MessageController';
import messages from '@/routes/messages';
import { createWhatsappClient } from '@/config/whatsapp';
import { MessageService } from '@/services/MessageService';

const app = express();

app.use(express.json());
dotenv.config();

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        message: 'Health check passed',
        timestamp: new Date().toISOString(),
    });
});

async function initWhatsApp(): Promise<void> {
    try {
        let client: Client = await createWhatsappClient()
        const messageService = new MessageService(client)
        
        const messageController = new MessageController(client, messageService)
        
        app.use('/api/messages', messages(messageController))
    } catch (error) {
        console.error('WhatsApp init failed: ', error)
        process.exit(1)
    }
}

initWhatsApp()

const HOST: string = process.env.HOST || 'localhost';
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});