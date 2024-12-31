import { ChatId, Client, Message } from "@open-wa/wa-automate";

export class MessageModel {
    private content: string
    private number: ChatId

    constructor(content?: string, number?: string) {
        this.content = content as string
        this.number = this.normalizeNumber(number)
    }

    async send(client: Client): Promise<boolean> {
        try {
            await client.sendText(this.number, this.content)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public listenMessage(client: Client, callback: (message: Message) => void): void {
        client.onMessage((message: Message) => {
            callback(message)
        })
    }

    private normalizeNumber(number?: string): ChatId {
        const targetNumber = number || process.env.TARGET_NUMBER || ''
        return targetNumber.endsWith('@c.us') ? targetNumber as ChatId : `${targetNumber}@c.us` as ChatId
    }
} 