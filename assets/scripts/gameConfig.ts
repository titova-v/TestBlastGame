export const FIELD_SIZE = { WIDTH: 9, HEIGHT: 9}
export const MAX_FIELD_SIZE = { WIDTH: 9, HEIGHT: 9 }
export const TILE_SIZE = { WIDTH: 171, HEIGHT: 192 }
export const FIELD_MARGIN_X = 0
export const FIELD_MARGIN_Y = 46

export const TILES_COLORS_COUNT = 5
export const TILES_COLORS = ['blue', 'green', 'purple', 'red', 'yellow']

export const MIN_TILES_COUNT_IN_GROUP = 2
export const MAX_SHUFFLE_COUNT = 4

export const MAX_MOVES_COUNT = 24
export const MIN_POINTS_COUNT = 100

export const DURATIONS = {

    }

export const EVENTS = {
    tileOnClick: 'tileOnClick'
}


/*item.position = new Vec3((tile.col + .5) * TILE_SIZE.WIDTH + FIELD_MARGIN_X - this.fieldWidth * TILE_SIZE.WIDTH * .5, TILE_SIZE.HEIGHT * this.fieldHeight + FIELD_MARGIN_Y, 0)
this.node.addChild(item)

const movingTime = this.tileMovingTime(tile.row)
const spriteOpacity = item.getComponent(UIOpacity);
spriteOpacity.opacity = 0

tween(spriteOpacity)
    .to(.25 * movingTime, { opacity: 255 })
    .start()

tween(item)
    .to(movingTime, { position: new Vec3((tile.col + .5) * TILE_SIZE.WIDTH + FIELD_MARGIN_X - this.fieldWidth * TILE_SIZE.WIDTH * .5, TILE_SIZE.HEIGHT * this.fieldHeight - (tile.row + .5) * TILE_SIZE.HEIGHT + FIELD_MARGIN_Y, 0) })
    .start()
    }*/