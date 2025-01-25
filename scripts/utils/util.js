import { system } from "@minecraft/server";
import * as UI from "@minecraft/server-ui";

export default class Util {
    /**
     * formを表示するのを待ちます
     * @param {Player} player - フォームを表示するプレイヤー
     * @param {UI.ActionFormData | UI.ModalFormData | UI.MessageFormData} form - フォーム
     * @returns {Promise<UI.ActionFormResponse | UI.ModalFormResponse | UI.MessageFormResponse>} - フォームの返り値
     */
    static formBusy(player, form) {
        return new Promise(res => {
            system.run(async function run() {
                const response = await form.show(player);
                const { canceled, cancelationReason: reason } = response;
                if (canceled && reason === UI.FormCancelationReason.UserBusy) return system.run(run);
                res(response);
            });
        });
    }
}