import { _decorator, Component, Node, game, Sprite, Color } from 'cc';
import { EVENTS } from './gameConfig';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    onLoad() {
        this.initListener()
    }

    makeBonus() {
       this.getComponent(Sprite).grayscale = true
    }

    initListener() {
        this.node.on(Node.EventType.TOUCH_START, () => {
            game.emit(EVENTS.tileOnClick, this.node)
        })
    }
}


