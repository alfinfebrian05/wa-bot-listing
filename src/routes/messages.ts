import { Router } from "express";
import { MessageController } from "@/controllers/MessageController";

export default (controller: MessageController): Router => {
    const router = Router()

    router.post('/send-message', controller.sendMessage.bind(controller))

    return router
}