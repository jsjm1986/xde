class Wife {
    constructor() {
        this.love = 100;
        this.mood = 100;
        this.trust = 100;
        this.isCollapsed = false;
        this.events = this.generateEvents();
    }

    generateEvents() {
        return [
            {
                text: "陪老婆逛街购物",
                effect: {
                    love: 10,
                    mood: 15,
                    trust: 5
                }
            },
            {
                text: "给老婆做一顿美食",
                effect: {
                    love: 15,
                    mood: 10,
                    trust: 5
                }
            },
            {
                text: "和老婆一起看电影",
                effect: {
                    love: 8,
                    mood: 12,
                    trust: 3
                }
            },
            {
                text: "加班到很晚",
                effect: {
                    love: -10,
                    mood: -15,
                    trust: -5
                }
            },
            {
                text: "忘记结婚纪念日",
                effect: {
                    love: -20,
                    mood: -25,
                    trust: -15
                }
            },
            {
                text: "和异性同事单独吃饭",
                effect: {
                    love: -15,
                    mood: -10,
                    trust: -20
                }
            }
        ];
    }

    updateStatus(effect) {
        this.love = Math.max(0, Math.min(100, this.love + effect.love));
        this.mood = Math.max(0, Math.min(100, this.mood + effect.mood));
        this.trust = Math.max(0, Math.min(100, this.trust + effect.trust));
        
        // 检查是否游戏结束
        if (this.love < 30 || this.mood < 20 || this.trust < 25) {
            this.collapse();
        }
    }

    collapse() {
        this.isCollapsed = true;
    }

    getRandomEvents(count = 3) {
        const shuffled = [...this.events].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    getStatus() {
        return {
            love: this.love,
            mood: this.mood,
            trust: this.trust,
            isCollapsed: this.isCollapsed
        };
    }
} 