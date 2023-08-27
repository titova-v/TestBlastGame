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
}


