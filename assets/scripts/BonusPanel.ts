import { _decorator, Label } from 'cc';
import { Panel } from './Panel';
const { ccclass, property } = _decorator;
 
@ccclass('BonusPanel ')
export class BonusPanel extends Panel {
    private _active: Boolean = false

    public get active() {
        return this._active
    }

    public set active(isActive: Boolean) {
        this._active = isActive
    }
}


