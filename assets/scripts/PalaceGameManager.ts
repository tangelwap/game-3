import { _decorator, Component, Node, Label, Button } from 'cc';
import { AdManager } from './AdManager';

const { ccclass, property } = _decorator;

@ccclass('PalaceGameManager')
export class PalaceGameManager extends Component {

    @property(Label)
    logLabel: Label = null;

    @property(Label)
    statsLabel: Label = null;

    @property(Node)
    choiceContainer: Node = null;

    private year: number = 0;
    private stats = {
        scheming: 0, // 心机
        beauty: 0,   // 容貌
        favor: 0,    // 圣宠
        family: 0    // 家世
    };

    private isDead: boolean = false;

    onLoad() {
        this.resetGame();
    }

    resetGame() {
        this.year = 0;
        this.stats = { scheming: 5, beauty: 5, favor: 0, family: 5 };
        this.logLabel.string = "你是秀女，今日入宫。";
        this.updateUI();
        this.presentChoice();
    }

    presentChoice() {
        // Clear old buttons
        this.choiceContainer.removeAllChildren();
        
        // Mock Event
        this.year++;
        const event = {
            desc: `第${this.year}年，你在御花园遇到了一只受惊的猫。`,
            options: [
                { text: "赶走它", change: { beauty: -1, scheming: 0 }, result: "猫抓伤了你的脸。" },
                { text: "喂食", change: { favor: 1, beauty: 0 }, result: "皇上正好路过，夸你有爱心。" },
                { text: "无视", change: { scheming: 1 }, result: "你冷静地走开了。" }
            ]
        };

        this.logLabel.string += `\n\n${event.desc}`;

        event.options.forEach((opt) => {
            const btnNode = new Node("Btn");
            const btn = btnNode.addComponent(Button);
            // ... Setup Button UI (Label, Sprite) ...
            
            btnNode.on(Button.EventType.CLICK, () => {
                this.selectOption(opt);
            }, this);

            this.choiceContainer.addChild(btnNode);
        });
    }

    selectOption(opt: any) {
        this.logLabel.string += `\n选择了: ${opt.text} -> ${opt.result}`;
        
        // Apply stats
        if (opt.change) {
            this.stats.beauty += opt.change.beauty || 0;
            this.stats.scheming += opt.change.scheming || 0;
            this.stats.favor += opt.change.favor || 0;
            this.stats.family += opt.change.family || 0;
        }
        
        this.updateUI();

        // Check fail condition
        if (this.stats.beauty < 0) {
            this.isDead = true;
            this.logLabel.string += "\n容貌尽毁，被打入冷宫。看广告复活？";
            // AdManager.instance.showVideoAd(...)
        } else {
            // Next turn logic (Delay or wait for click)
            this.presentChoice(); // Loop for demo
        }
    }

    updateUI() {
        this.statsLabel.string = `心机:${this.stats.scheming} 容貌:${this.stats.beauty} 圣宠:${this.stats.favor}`;
    }
}
