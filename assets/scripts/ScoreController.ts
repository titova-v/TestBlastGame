import { _decorator, Component, Label, tween } from 'cc';
import { MAX_MOVES_COUNT } from './gameConfig';
import { Panel } from './Panel';
import { ScorePanel } from './ScorePanel';
const { ccclass, property } = _decorator;

@ccclass('ScoreController')
export class ScoreController extends Component {
    @property(ScorePanel)
    score: ScorePanel
    @property(Panel)
    moves: Panel

    public get movesCount() {
        return this.moves.count
    }

    public get scoreCount() {
        return this.score.count
    }

    onLoad() {
        this.moves.count = MAX_MOVES_COUNT
        //this.moves.updateLabel()
    }

    updateScore(tilesCount: number = 0): void {
        this.moves.decrementCount()
        const points = this.calculatePoints(tilesCount)
        this.score.addPointsToScore(points)

        this.updateLabels()
    }

    updateLabels(): void {
        this.score.updateLabel()
        this.moves.updateLabel()
    }

    calculatePoints(tilesCount: number): number {
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
}