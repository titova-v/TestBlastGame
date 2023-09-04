import { math } from 'cc';

export class BlastCore {
    // �������������
    shuffle(field: Array<Array<object>>): Array<Array<object>> {
        field.sort(() => math.random() - 0.5);
        field.forEach((allRow, row) => {
            allRow.forEach((cell, col) => {
                Object.assign(cell, {row, col})
            })
        })
        return field
    }

      // �������� �������� ����
    createField(width: number, height: number, colors: Array<string>): Array<Array<object>> {
        let field: Array<Array<object>> = []
        for (let row = 0; row < height; row++) {
            let allRow: Array<object> = []
            for (let col = 0; col < width; col++) {
                allRow.push(this.createNewTile(row, col, colors))
            }
            field.push(allRow)
        }
        return field
    }

    // ����������� ������� ������ �� ������ �����
    moveTiles(field: Array<Array<object>>): Array<Array<object>> {
        for (let row = field.length - 1; row > -1; row--) {
            field[row].forEach((tile, col) => {
                if (tile == null) {
                    let movingTile: object
                    for (let targetRow = row - 1; targetRow > -1; targetRow--) { // ����� ������� ������������� ����� ��� ���������, ������� ������������� � ������ ������
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
        }

        return field
    }

    // �������� ������ ����� ���������� �����
    createNewTile(row: number, col: number, colors: Array<string>): object {
        return { row, col, color: this.getRandomColor(colors) }
    }

    getRandomColor(colors: Array<string>): string {
        return colors[math.randomRangeInt(0, colors.length)]
    }

    // �������� ������ ������
    removeTiles(field: Array<Array<object>>, tiles: Array<object>): Array<Array<object>> {
        tiles.forEach(tile => {
            field[tile.row][tile.col] = null
        })
        return field
    }

    // �������� ������� �����
    checkMoves(field: Array<Array<object>>): Boolean {
        let hasMoves: Boolean = false

        field.forEach(row => {
            row.forEach(cell => {
                this.findSiblingTiles(field, cell).length && (hasMoves = true)
            })
        })

        return hasMoves
    }

    // ����� ������ ������ �� �����
    findGroupByColor(field: Array<Array<object>>, tile: object, group: Array<object> = [tile]): Array<object> {
        let siblings: Array<object> = this.findSiblingTiles(field, tile)

        siblings.forEach(sibling => {
            if (!this.groupContainTile(group, sibling)) { // ����� �������� ������ ���� �� ����� ��� ������� ������ ��������� �����
                group.push(sibling)
                this.findGroupByColor(field, sibling, group).forEach(nextSibling => {
                    if (!this.groupContainTile(group, nextSibling))
                        group.push(nextSibling)
                })
            }
        })

        return group
    }

    // ����� ������ ������ �� ������ �������
    findGroupInColumn(field: Array<Array<object>>, tile: object, group: Array<object> = [tile]): Array<object> {
        field.forEach(row => {
            group.push(row[tile.col])
        })
        return group
    }

    // ����� ������ ������ � �������� �������
    findGroupByRadius(field: Array<Array<object>>, tile: object, radius: number, group: Array<object> = [tile]): Array<object>  {
        field.forEach(row => {
            row.forEach(cell => {
                if (math.bits.abs(cell.row - tile.row) < radius && math.bits.abs(cell.col - tile.col) < radius) {
                    group.push(cell)
                }
            })
        })
        return group
    }

    // �������� ��������� ����� � ������������ ������
    groupContainTile(group: Array<object>, tile: object): Boolean {
        return !!group.find(cell => cell.row == tile.row && cell.col == tile.col)
    }

    // ����� �������� ������ ������ �� �����
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


