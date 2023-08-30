import { _decorator, Component, Node, math, Prefab, instantiate, Vec3, tween, UIOpacity } from 'cc';
import { BlastCore } from './BlastCore';
import { BONUS_ACTIVATION_RADIUS, DURATIONS, FIELD_MARGIN_X, FIELD_MARGIN_Y, FIELD_SIZE, MAX_FIELD_SIZE, TILES_COLORS, TILES_COLORS_COUNT, TILE_SIZE } from './gameConfig';
import { Tile } from './Tile';

const { ccclass, property } = _decorator;

@ccclass('Field')
export class Field extends Component {
    @property(Prefab)
    yellowTile: Prefab | null = null;
    @property(Prefab)
    greenTile: Prefab | null = null;
    @property(Prefab)
    blueTile: Prefab | null = null;
    @property(Prefab)
    purpleTile: Prefab | null = null;
    @property(Prefab)
    redTile: Prefab | null = null;

    private fieldWidth: number = Math.min(FIELD_SIZE.WIDTH, MAX_FIELD_SIZE.WIDTH)
    private fieldHeight: number = Math.min(FIELD_SIZE.HEIGHT, MAX_FIELD_SIZE.HEIGHT)
    private tiles: Array<string>
    private field: Array<Array<object>>

    coreBlast = new BlastCore()

    start() {
        this.tiles = this.initColors(TILES_COLORS_COUNT)

        this.field = this.coreBlast.createField(this.fieldWidth, this.fieldHeight, this.tiles)

        this.initView()
    }

    // добавление спрайта тайла на поле
    addTile(tile: object, withAnim: Boolean = false): any {
        const item = instantiate(this[`${tile.color}Tile`])
        item.row = tile.row
        item.col = tile.col
        item.position = new Vec3((tile.col + .5) * TILE_SIZE.WIDTH + FIELD_MARGIN_X - this.fieldWidth * TILE_SIZE.WIDTH * .5, TILE_SIZE.HEIGHT*this.fieldHeight - (tile.row + .5) * TILE_SIZE.HEIGHT + FIELD_MARGIN_Y, 0)
        this.node.addChild(item)

        if (withAnim) {
            const spriteOpacity = item.getComponent(UIOpacity);
            spriteOpacity.opacity = 0

            tween(spriteOpacity)
                .to(.05, { opacity: 255 })
                .start()

            item.position = new Vec3((tile.col + .5) * TILE_SIZE.WIDTH + FIELD_MARGIN_X - this.fieldWidth * TILE_SIZE.WIDTH * .5, TILE_SIZE.HEIGHT * this.fieldHeight + FIELD_MARGIN_Y, 0)
            item.prevRow = 0

            return this.moveTile(item)
        } else
            return Promise.resolve()
    }

    // отрисовка пол€
    initView(): void {
        this.field.forEach(row => {
            row.forEach(cell => {
                this.addTile(cell)
            })
        })
    }

    // генераци€ группы тайлов одного цвета
    getColorGroup(tile: Node): Array<object> {
        return this.coreBlast.findGroupByColor(this.field, this.field[tile.row][tile.col])
    }

    // определение палитры цветов тайлов
    initColors(count): Array<string> {
        let tiles: Array<string> = []
        for (let index = 0; index < count; index++) {
            let color: string = TILES_COLORS[index]
            tiles.push(color)
        }

        return tiles
    }

    // удаление группы тайлов
    destroyGroup(group: Array<object>): void {
        group.forEach(tile => {
            const tileNode = this.node.children.find(child => child.row == tile.row && child.col == tile.col)
            this.removeTileNode(tileNode)
        })
        this.field = this.coreBlast.removeTiles(this.field, group)
    }

    // удаление спрайта тайла с анимацией
    removeTileNode(tile: Node) {
        tween(tile)
            .to(.1, { scale: new Vec3(0, 0, 0) }, {easing: 'quadOut'})
            .call(() => tile.removeFromParent())
            .start()
    }

    // анимаци€ мигани€ тайла
    blinkTile(tile: Node): void {
        const spriteOpacity = tile.getComponent(UIOpacity);
        tween(spriteOpacity)
            .to(.15, { opacity: 175 }, {easing: 'sineInOut'})
            .to(.15, { opacity: 255 }, { easing: 'sineInOut' })
            .to(.15, { opacity: 175 }, { easing: 'sineInOut' })
            .to(.15, { opacity: 255 }, { easing: 'sineInOut' })
            .start()
    }

    // перемещение тайлов на пустые €чейки
    moveTilesNodes() {
        return new Promise(resolve => {
            let allMoves = []
            for (let row = this.field.length - 1; row > -1; row--) {
                this.field[row].forEach((tile, col) => {
                    if (tile && tile.prevRow != undefined) {
                        const tileNode = this.node.children.find(child => child.row == tile.prevRow && child.col == col)
                        tileNode.prevRow = tile.prevRow
                        delete tile.prevRow
                        tileNode.row = row
                        allMoves.push(this.moveTile(tileNode))
                    }
                })
            }

            Promise.all(allMoves).then(resolve)
        })
    }

    // создание бонусного тайла
    createBonusTile(tile: Node) {
        tile.bonus = true
        this.field[tile.row][tile.col].bonus = true

        this.node.children.find(child => child.row == tile.row && child.col == tile.col).getComponent(Tile).makeBonus()
    }

    // генераци€ группы тайлов из одного столбца (дл€ бонусного тайла)
    getColumnGroup(tile: Node): Array<object> {
        return this.coreBlast.findGroupInColumn(this.field, this.field[tile.row][tile.col])
    }

    // генераци€ группы тайлов в радиусе BONUS_ACTIVATION_RADIUS (дл€ бомбы)
    getTilesGroupByRadius(tile: Node): Array<object> {
        return this.coreBlast.findGroupByRadius(this.field, this.field[tile.row][tile.col], BONUS_ACTIVATION_RADIUS)
    }

    // проверка наличи€ ходов
    checkMoves(): Boolean {
        return this.coreBlast.checkMoves(this.field)
    }

    // выполнение хода (разрушение тайлов -> передвижение -> заполнение пробелов)
    makeMove(group) {
        this.destroyGroup(group)

        return new Promise(resolve => {
            this.moveExistingTiles()
                .then(this.fillEmptyCells.bind(this))
                .then(resolve)
        })       
    }

    // передвижение существующих тайлов
    moveExistingTiles() {
        this.field = this.coreBlast.moveTiles(this.field)

        return new Promise(resolve => {
            this.moveTilesNodes().then(resolve)
        })
    }

    // анимаци€ передвижени€ тайлов
    moveTile(tile: Node) {
        const path = tile.row - tile.prevRow
        const position = new Vec3(tile.position.x, TILE_SIZE.HEIGHT * this.fieldHeight - (tile.row + .5) * TILE_SIZE.HEIGHT + FIELD_MARGIN_Y, 0)

        return new Promise(resolve => tween(tile)
            .to(this.getTileMovingTime(path), {position})
            .call(() => { delete tile.prevRow }).call(resolve)
            .start())
    }

    // заполнение пустых €чеек новыми тайлами
    fillEmptyCells() {
        return new Promise(resolve => {
            let allMoves: Array<any> = []
            let delayIndex = 0

            for (let row = this.field.length - 1; row > -1; row--) {
                let rowHasEmptyTiles: Boolean = false

                this.field[row].forEach((cell, col) => {
                    if (cell == null) {
                        rowHasEmptyTiles = true
                        allMoves.push(new Promise(movingResolve =>
                            tween(this.node)
                                .delay(this.getTileMovingTime(delayIndex))
                                .call(() => {
                                    this.field[row][col] = this.coreBlast.createNewTile(row, col, this.tiles)
                                    this.addTile(this.field[row][col], true).then(movingResolve)
                                })
                                .start()))
                        }
                })

                rowHasEmptyTiles && delayIndex++
            }

            Promise.all(allMoves).then(resolve)
        })
    }

    // перемешивание тайлов
    shuffle() {
        this.field = this.coreBlast.shuffle(this.field)
        
        this.node.removeAllChildren()

        this.initView()
    }

    // вычисление времени анимации передвижени€ тайла в соотв-вии с длиной пути
    getTileMovingTime(path: number): number {
        return DURATIONS.tileMoving*path
    }
}


