import { _decorator, Component, Node, game, ParticleSystem2D } from 'cc';
import { EVENTS } from './gameConfig';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    onLoad() {
        this.initListener()
    }

    makeBonus(): void {
        this.node.getChildByName('parts').getComponent(ParticleSystem2D).resetSystem()
    }

    initListener(): void {
        this.node.on(Node.EventType.TOUCH_START, () => {
            game.emit(EVENTS.tileOnClick, this.node)
        })
    }
}


