import { Player } from "@minecraft/server";
import * as UI from "@minecraft/server-ui";
import SelectPlayerForm from "./SelectPlayer";

/**
 * @param {Player} player 
 * @param {Player} target 
 * @param {string | number} slot 
 */
export default async function SelectItemForm(player, target, slot) {
    const form = new UI.ActionFormData();

    let item = null;

    const playerContainer = player.getComponent("inventory")?.container;
    const targetEquippable = target.getComponent("equippable");
    const targetContainer = target.getComponent("inventory")?.container;

    if (!targetEquippable && !targetContainer) {
        player.sendMessage("§cエラー: 対象プレイヤーのデータが取得できませんでした。");
        return;
    }

    if (typeof slot === "string") item = targetEquippable.getEquipment(slot);
    else item = targetContainer.getItem(slot);

    const enchants = item.getComponent("enchantable")?.getEnchantments().map(v => `${v.type} - Lv.${v.level}`);

    form.title(`${target.name} - ${slot}`);
    form.body([
        `ID: ${item.typeId}`,
        `個数: ${item.amount}`,
        `nameTag: ${item.nameTag || ""}`,
        enchants && `Enchants:\n${enchants.join("\n")}`
    ].join("\n"));
    form.button("戻る");
    form.button("複製");
    form.button("スワップ");
    form.button("削除");

    const { selection, canceled } = await form.show(player);

    if (canceled) return;
    if (selection === 0) return await SelectPlayerForm(player, target);
    if (selection === 1) {
        const cloneItem = item.clone();

        playerContainer.addItem(cloneItem);
        player.sendMessage(`§a${cloneItem.typeId}を複製しました。`);
        return;
    }
    if (selection === 2) {
        const form = new UI.ModalFormData();

        form.title("スワップするアイテム数");
        form.slider("個数", 1, item.amount, 1, item.amount);
        form.submitButton("スワップ");

        const { formValues, canceled } = await form.show(player);

        if (canceled) return SelectItemForm(player, target, slot);
        
        const amount = formValues[0];

        if (item.amount === amount) item = undefined;
        else item.amount -= amount;

        if (typeof slot === "string") targetEquippable.setEquipment(slot, item);
        else targetContainer.setItem(slot, item);

        playerContainer.addItem(item);
        player.sendMessage(`§a${item.typeId}を${amount}個受け取りました。`);
        return;
    }
    if (selection === 3) {
        const form = new UI.ModalFormData();

        form.title("削除するアイテム数");
        form.slider("個数", 1, item.amount, 1, item.amount);
        form.submitButton("削除");

        const { formValues, canceled } = await form.show(player);

        if (canceled) return SelectItemForm(player, target, slot);
        
        const amount = formValues[0];

        if (item.amount === amount) item = undefined;
        else item.amount -= amount;

        if (typeof slot === "string") targetEquippable.setEquipment(slot, item);
        else targetContainer.setItem(slot, item);

        player.sendMessage(`§a${item.typeId}を§d${target.name}§fの§cインベントリから削除§aしました。`);
        return;
    }
}
