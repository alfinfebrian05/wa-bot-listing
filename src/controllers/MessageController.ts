import { Request, Response } from "express";
import { Client } from "@open-wa/wa-automate";

import { MessageModel } from "@/models/MessageModel";
import { MessageService } from "@/services/MessageService";

interface MessageRequest {
    content: string,
    number?: string
}

export class MessageController {
    constructor(
        private readonly whatsappClient: Client,
        private readonly messageService: MessageService
    ) {
        this.setupMessageListener()
    }

    async sendMessage(req: Request<{}, {}, MessageRequest>, res: Response): Promise<void> {
        try {
            const {content, number} = req.body

            const message = new MessageModel(content, number)
            const result = await message.send(this.whatsappClient)
            
            if(!result) {
                res.status(400).json({success: false, message: 'Failed to send message ❌'})
                return;
            }

            res.status(200).json({success: true, message: 'Message sent successfully ✅'})
        } catch (error) {
            res.status(500).json({success: false, message: (error as Error).message})
        }
    }

    private setupMessageListener(): void {
        const message = new MessageModel('', '')
        
        message.listenMessage(this.whatsappClient, (message) => {
            this.messageService.handleWelcomeMessage(message)
            this.messageService.handleMessageIncoming(message)
        })
    }
}