import { _decorator, Component, Node, math, Prefab, instantiate, Vec3, game } from 'cc';
import { BlastCore } from './BlastCore';
import { FIELD_MARGIN_X, FIELD_MARGIN_Y, FIELD_SIZE, MAX_FIELD_SIZE, TILES_COLORS, TILES_COLORS_COUNT, TILE_SIZE, EVENTS, MIN_TILES_COUNT_IN_GROUP } from './gameConfig';

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
        this.tiles = this.initTiles(TILES_COLORS_COUNT)

        this.field = this.coreBlast.createField(this.fieldWidth, this.fieldHeight, this.tiles)

        this.initFieldView()

        game.on(EVENTS.tileOnClick, tile => this.onTileClick(tile))
    }

    update(deltaTime: number) {
        
    }

    addTile(tile: object) {
        const item = instantiate(this[`${tile.color}Tile`])
        item.row = tile.row
        item.col = tile.col
        item.position = new Vec3((tile.col + .5) * TILE_SIZE.WIDTH + FIELD_MARGIN_X - this.fieldWidth * TILE_SIZE.WIDTH * .5, TILE_SIZE.HEIGHT*this.fieldHeight - (tile.row + .5) * TILE_SIZE.HEIGHT + FIELD_MARGIN_Y, 0)
        this.node.addChild(item)
    }

    initFieldView(): void {
        this.field.forEach(row => {
            let coordY: number = 0
            row.forEach(cell => {
                let coordX: number = 0
                this.addTile(cell)
            })
        })
    }

    initTiles(count): Array<string> {
        let tiles: Array<string> = []
        for (let index = 0; index < count; index++) {
            let color: string = TILES_COLORS[index]
            tiles.push(color)
        }

        return tiles
    }

    onTileClick(tile: Node) {
        let group: Array<object> = this.coreBlast.generateGroup(this.field, this.field[tile.row][tile.col])

        if (group.length >= MIN_TILES_COUNT_IN_GROUP)
            this.destroyGroup(group)
        else
            this.falseTap(tile)
    }

    destroyGroup(group: Array<object>): void {
        group.forEach(tile => {
            this.node.children.find(child => child.row == tile.row && child.col == tile.col).removeFromParent()
        })
    }

    falseTap(tile: Node): void {
        
    }
}


