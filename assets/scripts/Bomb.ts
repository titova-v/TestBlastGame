import { _decorator, Component, Label, Node, game } from 'cc';
import { BOMB_COUNT, EVENTS } from './gameConfig';
const { ccclass, property } = _decorator;

@ccclass('Bomb')
export class Bomb extends Component {
    @property(Label)
    bombsLabel: Label

    private _bombs = BOMB_COUNT
    private _active: Boolean = false

    public get count() {
        return this._bombs
    }
    
    public get active() {
        return this._active
    }
    
    public set active(isActive: Boolean) {
        this._active = isActive
    }

    onLoad() {
        this.icon = this.node.getChildByName('bomb')
        this.updateLabel()
        this.initListener()
    }

    initListener() {
        this.node.on(Node.EventType.TOUCH_START, () => {
            game.emit(EVENTS.bombOnClick, this.node)
        })
    }

    updateLabel() {
        this.bombsLabel.string = this._bombs
    }

    decrementBombs() {
        this._bombs--
    }
}


