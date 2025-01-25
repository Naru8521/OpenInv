import { EquipmentSlot, ItemStack, Player } from "@minecraft/server";
import * as UI from "@minecraft/server-ui";
import Util from "../utils/util";
import SelectItemForm from "./SelectItem";

/**
 * @param {Player} player 
 * @param {Player} target 
 */
export default async function SelectPlayerForm(player, target) {
    const form = new UI.ActionFormData();

    const slots = [];

    const targetEquippable = target.getComponent("equippable");
    const targetContainer = target.getComponent("inventory")?.container;

    if (!targetEquippable && !targetContainer) {
        player.sendMessage("§cエラー: 対象プレイヤーのデータが取得できませんでした。");
        return;
    }

    form.title(`${target.name}のインベントリー`);

    const headItem = targetEquippable?.getEquipment(EquipmentSlot.Head);
    const chestItem = targetEquippable?.getEquipment(EquipmentSlot.Chest);
    const legItem = targetEquippable?.getEquipment(EquipmentSlot.Legs);
    const feetItem = targetEquippable?.getEquipment(EquipmentSlot.Feet);
    const offhandItem = targetEquippable?.getEquipment(EquipmentSlot.Offhand);

    renderItem(EquipmentSlot.Head, headItem, form) && slots.push(EquipmentSlot.Head);
    renderItem(EquipmentSlot.Chest, chestItem, form) && slots.push(EquipmentSlot.Chest);
    renderItem(EquipmentSlot.Legs, legItem, form) && slots.push(EquipmentSlot.Legs);
    renderItem(EquipmentSlot.Feet, feetItem, form) && slots.push(EquipmentSlot.Feet);
    renderItem(EquipmentSlot.Offhand, offhandItem, form) && slots.push(EquipmentSlot.Offhand);

    for (let i = 0; i < targetContainer?.size; i++) {
        const item = targetContainer.getItem(i);

        renderItem(i, item, form) && slots.push(i);
    }

    const { selection, canceled } = await Util.formBusy(player, form);

    if (canceled) return;

    await SelectItemForm(player, target, slots[selection]);
}

/**
 * @param {string | number} slot 
 * @param {ItemStack | undefined} item 
 * @param {UI.ActionFormData} form
 * @returns {boolean} 
 */
function renderItem(slot, item, form) {
    if (item) {
        const id = item.typeId;
        const amount = item.amount;

        form.button(`${id} - ${amount}\nスロット: ${slot}`);
        return true;
    }
    return false;
}
