import { Player, world } from "@minecraft/server";
import * as UI from "@minecraft/server-ui";
import Util from "../utils/util";
import SelectPlayerForm from "./SelectPlayer";

/**
 * @param {Player} player 
 */
export default async function PlayersListForm(player) {
    const targets = world.getAllPlayers();
    const form = new UI.ActionFormData();

    form.title("プレイヤーリスト");
    form.body("インベントリを表示するプレイヤーを選択してください。");

    for (const target of targets) {
        form.button(target.name);
    }

    const { selection, canceled } = await Util.formBusy(player, form);

    if (canceled) return;
    await SelectPlayerForm(player, targets[selection]);
}