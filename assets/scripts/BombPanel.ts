import { _decorator, Node, game } from 'cc';
import { BonusPanel } from './BonusPanel';
import { BOMB_COUNT, EVENTS } from './gameConfig';
const { ccclass, property } = _decorator;

@ccclass('BombPanel')
export class BombPanel extends BonusPanel {
    _count = BOMB_COUNT

    onLoad() {
        super.onLoad()

        this.icon = this.node.getChildByName('bomb')
      
    }

    initListener(): void {
        this.node.on(Node.EventType.TOUCH_START, () => {
            game.emit(EVENTS.bombOnClick, this.node)
        })
    }
}


