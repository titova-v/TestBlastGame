import { _decorator, Component, Label, tween } from 'cc';
import { DURATIONS, MAX_MOVES_COUNT } from './gameConfig';
const { ccclass, property } = _decorator;

@ccclass('Score')
export class Score extends Component {
    @property(Label)
    scoreLabel: Label
    @property(Label)
    movesLabel: Label

    private _score = 0
    private _moves = MAX_MOVES_COUNT

    public get scoreCount() {
        return this._score
    }

    public get movesCount() {
        return this._moves
    }


    onLoad() {
        this.updateLabels()
    }

    calculatePoints(tilesCount: number) {
        let points: number = tilesCount
        switch (tilesCount) {
            case 2:
            case 3:
            case 4:
                points *= 2
                break;
            case 5:
            case 6:
            case 7:
                points *= 3
                break;
            case 8:
            default:
                points *= 4
                break;
        }

        return points
    }

    updateLabels(tilesCount: number = 0) {
        this.updateMoves()
        this.updateScore(tilesCount)
    }

    updateMoves() {
        this.decrementMoves()
        this.updateMovesLabel()
    }

    updateMovesLabel() {
        this.movesLabel.string = this.movesCount
    }

    decrementMoves() {
        this._moves--
    }

    updateScore(tilesCount: number) {
        const points = this.calculatePoints(tilesCount)
        this.addPointsToScore(points)
        this.updateScoreLabel()
    }

    updateScoreLabel(withAnim = true) {
        if (withAnim) {
            let repeatCount = Number(this._score) - Number(this.scoreLabel.string)
            tween(this.scoreLabel)
                .to(DURATIONS.labelUpdate / repeatCount, {}, {
                    onComplete: () => {
                        let score = Number(this.scoreLabel.string)
                        this.scoreLabel.string = (++score).toString()
                    }
                })
                .repeat(repeatCount)
                .start()
        } else
            this.scoreLabel.string = this._score
    }

    addPointsToScore(points) {
        this._score += points
    }
}