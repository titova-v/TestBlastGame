import { _decorator, Component, Node, math, game } from 'cc';
import { EVENTS, FIELD_SIZE, MAX_FIELD_SIZE, TILES_COLORS, TILES_COLORS_COUNT } from './gameConfig';
import { BlastCore } from './BlastCore';
import { Field } from './Field';
const { ccclass, property } = _decorator;


@ccclass('GameController')
export class GameController extends Component {
    start() {
        //this.field = find
    }

    onLoad() {
        this.initListener()
    }

    update(deltaTime: number) {

    }

    initListener() {
        game.on(EVENTS.tileOnClick, tile => console.log(tile))
    }
}