import { _decorator, Component, Node, game } from 'cc';
import { EVENTS } from './gameConfig';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    start() {

    }

    onLoad() {
        this.initListener()
    }

    update(deltaTime: number) {

    }

    initListener() {
        this.node.on(Node.EventType.TOUCH_START, () => {
            game.emit(EVENTS.tileOnClick, this.node)
        })
    }
}


