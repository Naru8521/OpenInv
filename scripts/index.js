import { world } from "@minecraft/server";
import CommandHandler from "./modules/commandHandler";
import { commands, commandSettings, commandsPath } from "./config";

const commandHandler = new CommandHandler(commandsPath, commandSettings, commands);

world.beforeEvents.chatSend.subscribe(ev => {
    if (commandHandler.isCommand(ev)) {
        commandHandler.handleCommand(ev);
    }
});