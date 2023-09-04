import { math } from 'cc';

export class BlastCore {
    private _height: number = 0
    private _width: number = 0

    constructor(size) {
        this._height = size.height
        this._width = size.width
    }

    // перемешивание
    shuffle(field: Array<object>): Array<object> {
        field.sort(() => math.random() - 0.5);
        field.forEach((cell, index) => {
             Object.assign(cell, {row: parseInt(index/this._width), col: index% this._width})
        })
        return field
    }

      // создание игрового пол€
    createField(colors: Array<string>): Array<object> {
        let field: Array<object> = []
        for (let row = 0; row < this._height; row++) {
            for (let col = 0; col < this._width; col++) {
                field.push(this.createNewTile(row, col, colors))
            }
        }
        return field
    }

    // перемещение верхних тайлов на пустые места
    moveTiles(field: Array<object>): Array<object> {
        field.reverse().forEach(tile => {
            if (tile.removed) {
                let movingTile: object = field.find(cell => !cell.removed && cell.col == tile.col && cell.row < tile.row) // поиск первого существующего тайла над удаленным, который переместитьс€ в пустую €чейку
               
                if (!movingTile)
                    return

                Object.assign(tile, { color: movingTile.color, prevRow: movingTile.row })
                delete tile.removed
                movingTile.bonus && (tile.bonus = true)
                movingTile.removed = true
            }
        })
        /*for (let row = field.length - 1; row > -1; row--) {
            field[row].forEach((tile, col) => {
                if (tile == null) {
                    let movingTile: object
                    for (let targetRow = row - 1; targetRow > -1; targetRow--) { // поиск первого существующего тайла над удаленным, который переместитьс€ в пустую €чейку
                        let iterationTile = field[targetRow][col]
                        if (iterationTile && !iterationTile.removed) {
                            movingTile = iterationTile
                            break
                        }
                    }
                    if (!movingTile)
                        return

                    field[row][col] = { row, col, color: movingTile.color, prevRow: movingTile.row }
                    movingTile.bonus && (field[row][col].bonus = true)
                    field[movingTile.row][movingTile.col] = null
                }
            })
        }*/

        return field.reverse()
    }

    // создание нового тайла рандомного цвета
    createNewTile(row: number, col: number, colors: Array<string>): object {
        return { row, col, color: this.getRandomColor(colors) }
    }

    getRandomColor(colors: Array<string>): string {
        return colors[math.randomRangeInt(0, colors.length)]
    }

    // пометка об удалении тайла группы тайлов
    removeTiles(field: Array<object>, tiles: Array<object>): Array<object> {
        tiles.forEach(tile => {
            field.find(child => child.row == tile.row && child.col == tile.col).removed = true
        })
        return field
    }

    // проверка наличи€ ходов
    checkMoves(field: Array<object>): Boolean {
        let hasMoves: Boolean = false

        field.forEach(cell => {
            this.findSiblingTiles(field, cell).length && (hasMoves = true)
        })

        return hasMoves
    }

    // поиск группы тайлов по цвету
    findGroupByColor(field: Array<object>, tile: object, group: Array<object> = [tile]): Array<object> {
        let siblings: Array<object> = this.findSiblingTiles(field, tile)

        siblings.forEach(sibling => {
            if (!this.groupContainTile(group, sibling)) { // поиск соседних тайлов того же цвета дл€ каждого нового соседнего тайла
                group.push(sibling)
                this.findGroupByColor(field, sibling, group).forEach(nextSibling => {
                    if (!this.groupContainTile(group, nextSibling))
                        group.push(nextSibling)
                })
            }
        })

        return group
    }

    // поиск группы тайлов по номеру колонки
    findGroupInColumn(field: Array<object>, tile: object): Array<object> {
        let group: Array<object> = []

        group = field.filter(child => child.col == tile.col)

        return group
    }

    // поиск группы тайлов в заданном радиусе
    findGroupByRadius(field: Array<object>, tile: object, radius: number, group: Array<object> = [tile]): Array<object>  {
        field.forEach(cell => {
            if (math.bits.abs(cell.row - tile.row) < radius && math.bits.abs(cell.col - tile.col) < radius) {
                group.push(cell)
            }
        })

        return group
    }

    // проверка вхождени€ тайла в существующую группу
    groupContainTile(group: Array<object>, tile: object): Boolean {
        return !!group.find(cell => cell.row == tile.row && cell.col == tile.col)
    }

    // поиск соседних тайлов такого же цвета
    findSiblingTiles(field: Array<object>, tile: object): Array<object> {
        let siblings: Array<object> = []
        let tileColor: string = tile.color
        let currentTile = field.find(child => child.row == tile.row - 1 && child.col == tile.col)

        let checkCurrentTile = () => {
            if (currentTile && currentTile.color == tileColor)
                siblings.push(currentTile)
        }

        checkCurrentTile()

        currentTile = field.find(child => child.row == tile.row && child.col == tile.col - 1)

        checkCurrentTile()

        currentTile = field.find(child => child.row == tile.row && child.col == tile.col + 1)

        checkCurrentTile()

        currentTile = field.find(child => child.row == tile.row + 1 && child.col == tile.col)

        checkCurrentTile()

        return siblings
    }
}


