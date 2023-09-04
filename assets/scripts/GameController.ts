import { _decorator, Component, Node, game, Label, tween, Vec3, director } from 'cc';
import { EVENTS, MIN_POINTS_COUNT, MIN_TILES_COUNT_IN_GROUP, BONUS_TILE_GROUP_SIZE, MAX_SHUFFLE_COUNT } from './gameConfig';
import { Field } from './Field';
import { BombPanel } from './BombPanel';
import { ScoreController } from './ScoreController';
const { ccclass, property } = _decorator;


@ccclass('GameController')
export class GameController extends Component {
    @property(Field)
    field: Field
    @property(ScoreController)
    score: ScoreController
    @property(BombPanel)
    bomb: BombPanel

    private shufflesCount: number = 0

    onLoad() {
        this.initListener()
    }

    initListener(): void {
        game.on(EVENTS.tileOnClick, tile => this.onTileClick(tile))
        game.on(EVENTS.bombOnClick, () => this.switchBomb())
    }

    onTileClick(tile: Node) {
        if (this.isCtrlLocked())
            return

        this.lockCtrl()
        let group: Array<object> = this.field.getColorGroup(tile)
        let tilesCount: number = group.length
        let isBomb: Boolean = this.bomb.active

        if (isBomb) {
            group = this.field.getTilesGroupByRadius(tile)
            this.updateBombsCount()
            this.deactivateBomb()
        } else if (tile.bonus) {
            group = this.field.getColumnGroup(tile)
            tilesCount = group.length
        } else if (tilesCount >= BONUS_TILE_GROUP_SIZE) {
            group = group.filter(cell => !(cell.col == tile.col && cell.row == tile.row))
            this.field.createBonusTile(tile)
        } else
            group = group.filter(cell => !cell.bonus)

        if (isBomb || tilesCount >= MIN_TILES_COUNT_IN_GROUP) {
            this.field.makeMove(group).then(() => {
                if (this.checkGameProgress()) {
                    this.checkEnableMoves()
                    this.unlockCtrl()
                }
            })
            this.score.updateScore(tilesCount)
        }
        else {
            this.falseMove(tile)
            this.unlockCtrl()
        }
    }

    updateBombsCount(): void {
        this.bomb.decrementCount()
        this.bomb.updateLabel()
    }

    // проверка наличия ходов и решафл
    checkEnableMoves(): void {
        if (this.shufflesCount >= MAX_SHUFFLE_COUNT)
            this.showFailScene()
        else if (!this.field.checkMoves()) {
            this.field.shuffle()
            this.shufflesCount++
        }
    }

    // проверка наличия ходов и достижения цели игры
    checkGameProgress(): Boolean {
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

    // переключение сцены в случае фейла
    showFailScene(): void {
        director.loadScene('failScene')
    }

    // переключение сцены в случае выигрыша
    showWinScene(): void {
        director.loadScene('winScene')
    }

    // вкл/выкл активации бомбы
    switchBomb(): void {
        if (this.bomb.count)
            this.bomb.active = !this.bomb.active
        
        if (this.bomb.active)
            this.startBombIconAnimation()
        else
            this.stopBombIconAnimation()
    }

    // принудительное отключение бомбы (после выполнения хода)
    deactivateBomb(): void {
        this.bomb.active = false

        this.stopBombIconAnimation()
    }

    // анимация иконки бомбы
    startBombIconAnimation(): void {
        if (!this.bomb.iconAnimation) {
            let bombIcon = this.bomb.icon
            let bombScale = bombIcon.scale.x
            bombIcon.defaultScale = new Vec3(bombScale, bombScale, bombScale)
            this.bomb.iconAnimation = tween(bombIcon)
                .to(.15, { scale: new Vec3(bombScale * 1.1, bombScale * 1.1, bombScale * 1.1) }, {easing: 'sineOutIn'})
                .to(.15, { scale: bombIcon.defaultScale }, { easing: 'sineOutIn' })
                .union()
                .repeatForever()
        }
        this.bomb.iconAnimation.start()
    }

    stopBombIconAnimation(): void {
        this.bomb.iconAnimation && this.bomb.iconAnimation.stop()
        this.bomb.icon.scale = this.bomb.icon.defaultScale
    }

    falseMove(tile: Node): void {
        this.field.blinkTile(tile)
    }

    // блокировка управления
    lockCtrl(): void {
        this.locked = true
    }

    // разблокировка управления
    unlockCtrl(): void {
        this.locked = false
    }

    isCtrlLocked(): Boolean {
        return this.locked
    }
}