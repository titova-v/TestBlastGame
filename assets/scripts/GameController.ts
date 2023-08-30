import { _decorator, Component, Node, game, Label, tween } from 'cc';
import { DURATIONS, EVENTS, MIN_POINTS_COUNT, MIN_TILES_COUNT_IN_GROUP, BONUS_TILE_GROUP_SIZE } from './gameConfig';
import { Field } from './Field';
import { Score } from './Score';
const { ccclass, property } = _decorator;


@ccclass('GameController')
export class GameController extends Component {
    @property(Field)
    field: Field
    @property(Score)
    score: Score

    onLoad() {
        this.initListener()

        //game.addPersistRootNode(this.node)
    }

    initListener() {
        game.on(EVENTS.tileOnClick, tile => this.onTileClick(tile))
    }

    onTileClick(tile: Node) {
        if (this.isCtrlLocked())
            return

        this.lockCtrl()
        let group: Array<object> = this.field.getColorGroup(tile)
        let tilesCount: number = group.length

        if (tile.bonus) {
            group = this.field.getColumnGroup(tile)
            tilesCount = group.length
        } else if (tilesCount >= BONUS_TILE_GROUP_SIZE) {
            group = group.filter(cell => !(cell.col == tile.col && cell.row == tile.row))
            this.field.createBonusTile(tile)
        }

        if (tilesCount >= MIN_TILES_COUNT_IN_GROUP) {
            this.field.makeMove(group).then(() => {
                if (this.checkGameProgress())
                    this.unlockCtrl()
            })
            this.score.updateLabels(tilesCount)
        }
        else {
            this.falseMove(tile)
            this.unlockCtrl()
        }
    }

    checkGameProgress() {
        if (this.score.movesCount == 0 && this.score.scoreCount < MIN_POINTS_COUNT) {
            this.showFailScene()
            return false
        }
        else if (this.score.movesCount >= 0 && this.score.scoreCount >= MIN_POINTS_COUNT) {
            this.showWinScene()
            return false
        }
        else
            return true
    }

    showFailScene() {
       // game.addPersistRootNode()
    }

    showWinScene() {

    }

    falseMove(tile: Node) {
        this.field.blinkTile(tile)
    }

    lockCtrl(): void {
        this.locked = true
    }

    unlockCtrl(): void {
        this.locked = false
    }

    isCtrlLocked(): Boolean {
        return this.locked
    }
}