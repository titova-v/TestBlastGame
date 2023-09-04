import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Panel')
export class Panel extends Component {
    @property(Label)
    label: Label

    private _count = 0

    onLoad() {
        this.updateLabel()
        this.initListener()
    }

    public set count(count) {
        this._count = count
    }

    public get count() {
        return this._count
    }

    initListener() { }

    decrementCount(): void {
        this._count--
    }

    updateLabel(): void {
        this.label.string = this._count
    }
}


