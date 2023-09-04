import { _decorator, Component, Node, tween } from 'cc';
import { DURATIONS } from './gameConfig';
import { Panel } from './Panel';
const { ccclass, property } = _decorator;

@ccclass('ScorePanel')
export class ScorePanel extends Panel {
    updateLabel(withAnim = true): void {
        if (withAnim) {
            let repeatCount = Number(this.count) - Number(this.label.string)
            tween(this.label)
                .to(DURATIONS.labelUpdate / repeatCount, {}, {
                    onComplete: () => {
                        let score = Number(this.label.string)
                        this.label.string = (++score).toString()
                    }
                })
                .repeat(repeatCount)
                .start()
        } else
            this.label.string = this.count
    }

    addPointsToScore(points): void {
        this.count += points
    }
}


