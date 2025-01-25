import { Block, Entity, Player, world } from "@minecraft/server";
import PlayersListForm from "../forms/PlayersList";
import SelectPlayerForm from "../forms/SelectPlayer";

/**
 * @param {string[]} args 
 * @param {{ player: Player?, entity: Entity?, initiator: Entity?, block: Block? }} ev 
 */
export async function run(args, ev) {
    const { player, entity, initiator, block } = ev;

    if (player) {
        if (args[0]) {
            const targetName = args[0].replace("@", "");
            const target = world.getPlayers({ name: targetName })[0];

            if (target) {
                await SelectPlayerForm(player, target);
                return;
            } else {
                player.sendMessage(`§cエラー: ${targetName}が見つかりませんでした。`);
                return;
            }
        }
        
        await PlayersListForm(player);
        return;
    }
}