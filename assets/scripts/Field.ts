import { _decorator, Component, Node, math, Prefab, instantiate, Vec3, tween, UIOpacity } from 'cc';
import { BlastCore } from './BlastCore';
import { FIELD_MARGIN_X, FIELD_MARGIN_Y, FIELD_SIZE, MAX_FIELD_SIZE, TILES_COLORS, TILES_COLORS_COUNT, TILE_SIZE } from './gameConfig';
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
    coreBlast = new BlastCore()
    tiles: Array<string>
    private field: Array<Array<object>>

    start() {
        this.tiles = this.initColors(TILES_COLORS_COUNT)

        this.field = this.coreBlast.createField(this.fieldWidth, this.fieldHeight, this.tiles)

        this.initView()
    }

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
            item.prevRow = 0// item.row - 1

            return this.moveTile(item)
        } else
            return Promise.resolve()
    }

    initView(): void {
        this.field.forEach(row => {
            row.forEach(cell => {
                this.addTile(cell)
            })
        })
    }

    getColorGroup(tile: Node): Array<object> {
        return this.coreBlast.findGroupByColor(this.field, this.field[tile.row][tile.col])
    }

    initColors(count): Array<string> {
        let tiles: Array<string> = []
        for (let index = 0; index < count; index++) {
            let color: string = TILES_COLORS[index]
            tiles.push(color)
        }

        return tiles
    }

    destroyGroup(group: Array<object>): void {
        group.forEach(tile => {
            const tileNode = this.node.children.find(child => child.row == tile.row && child.col == tile.col)
            this.removeTileNode(tileNode)
        })
        this.field = this.coreBlast.removeTiles(this.field, group)
    }

    removeTileNode(tile: Node) {
        tween(tile)
            .to(.1, { scale: new Vec3(0, 0, 0) }, {easing: 'quadOut'})
            .call(() => tile.removeFromParent())
            .start()
    }

    blinkTile(tile: Node): void {
        const spriteOpacity = tile.getComponent(UIOpacity);
        tween(spriteOpacity)
            .to(.15, { opacity: 175 }, {easing: 'sineInOut'})
            .to(.15, { opacity: 255 }, { easing: 'sineInOut' })
            .to(.15, { opacity: 175 }, { easing: 'sineInOut' })
            .to(.15, { opacity: 255 }, { easing: 'sineInOut' })
            .start()
    }

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

    createBonusTile(tile: Node) {
        tile.bonus = true
        this.field[tile.row][tile.col].bonus = true

        this.node.children.find(child => child.row == tile.row && child.col == tile.col).getComponent(Tile).makeBonus()
    }

    getColumnGroup(tile: Node) {
        return this.coreBlast.findGroupInColumn(this.field, this.field[tile.row][tile.col])
    }

    getTilesGroupByRadius(tile: Node) {

    }

    makeMove(group) {
        this.destroyGroup(group)

        return new Promise(resolve => {
            this.moveExistingTiles()
                .then(this.fillEmptyCells.bind(this))
                .then(resolve)
        })       
    }

    moveExistingTiles() {
        this.field = this.coreBlast.moveTiles(this.field)

        return new Promise(resolve => {
            this.moveTilesNodes().then(resolve)
        })
    }

    moveTile(tile: Node) {
        const path = tile.row - tile.prevRow
        const position = new Vec3(tile.position.x, TILE_SIZE.HEIGHT * this.fieldHeight - (tile.row + .5) * TILE_SIZE.HEIGHT + FIELD_MARGIN_Y, 0)

        return new Promise(resolve => tween(tile)
            .to(this.getTileMovingTime(path), {position})
            .call(() => { delete tile.prevRow }).call(resolve)
            .start())
    }

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

    getTileMovingTime(path: number): number {
        return .075*path
    }
}


