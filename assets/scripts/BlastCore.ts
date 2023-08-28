import { math } from 'cc';

export class BlastCore {
    shuffle(count: number) {

    }

    createField(width: number, height: number, colors: Array<string>): Array<Array<object>> {
        let field: Array<Array<object>> = []
        for (let row = 0; row < height; row++) {
            let allRow: Array<object> = []
            for (let col = 0; col < width; col++) {
                allRow.push({ row, col, color: colors[math.randomRangeInt(0, colors.length - 1)] })
            }
            field.push(allRow)
        }
        return field
    }

    moveTiles() {

    }

    createNewTile() {

    }

    removeTiles(tiles: Array<object>) {

    }

    checkMoves(field: Array<Array<object>>): Boolean {
        let hasMoves: Boolean = false

        field.forEach(row => {
            row.forEach(cell => {

            })
        })

        return hasMoves
    }

    generateGroup(field: Array<Array<object>>, tile: object, group: Array<object> = [tile]): Array<object> {
        let siblings: Array<object> = this.findSiblingTiles(field, tile)

        siblings.forEach(sibling => {
            if (!this.groupContainTile(group, sibling)) {
                group.push(sibling)
                this.generateGroup(field, sibling, group).forEach(nextSibling => {
                    if (!this.groupContainTile(group, nextSibling))
                        group.push(nextSibling)
                })
            }
        })

        return group
    }

    groupContainTile(group: Array<object>, tile: object): Boolean {
        return !!group.find(cell => cell.row == tile.row && cell.col == tile.col)
    }

    findSiblingTiles(field: Array<Array<object>>, tile: object): Array<object> {
        let siblings: Array<object> = []
        let tileColor: string = field[tile.row][tile.col].color

        if (tile.row > 0 && field[tile.row - 1][tile.col].color == tileColor)
            siblings.push(field[tile.row - 1][tile.col])

        if (tile.col > 0 && field[tile.row][tile.col - 1].color == tileColor)
            siblings.push(field[tile.row][tile.col - 1])

        if (tile.col < field[tile.row].length - 1 && field[tile.row][tile.col + 1].color == tileColor)
            siblings.push(field[tile.row][tile.col + 1])

        if (tile.row < field.length - 1 && field[tile.row + 1][tile.col].color == tileColor)
            siblings.push(field[tile.row + 1][tile.col])

        return siblings
    }
}


