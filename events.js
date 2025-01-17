class EventSystem {
    constructor() {
        this.specialDates = this.generateSpecialDates();
        this.randomEvents = this.generateRandomEvents();
        this.currentDay = 1;
        this.currentMonth = 1;
    }

    generateSpecialDates() {
        return [
            {
                day: 14,
                month: 2,
                name: "情人节",
                description: "这是你们的第一个情人节",
                choices: [
                    {
                        text: "精心准备浪漫晚餐和礼物",
                        effect: { love: 30, mood: 25, trust: 15 },
                        waveAction: { type: 'POSITIVE', intensity: 2 }
                    },
                    {
                        text: "简单买束花和礼物",
                        effect: { love: 15, mood: 10, trust: 5 },
                        waveAction: { type: 'POSITIVE', intensity: 1 }
                    },
                    {
                        text: "忘记情人节",
                        effect: { love: -30, mood: -35, trust: -20 },
                        waveAction: { type: 'NEGATIVE', intensity: 2 }
                    }
                ]
            },
            {
                day: 14,
                month: 3,
                name: "结婚纪念日",
                description: "今天是你们的结婚纪念日",
                choices: [
                    {
                        text: "策划一次浪漫的周末旅行",
                        effect: { love: 35, mood: 30, trust: 20 },
                        waveAction: { type: 'POSITIVE', intensity: 2 }
                    },
                    {
                        text: "准备一份特别的礼物",
                        effect: { love: 20, mood: 15, trust: 10 },
                        waveAction: { type: 'POSITIVE', intensity: 1 }
                    },
                    {
                        text: "完全忘记这个日子",
                        effect: { love: -40, mood: -35, trust: -25 },
                        waveAction: { type: 'NEGATIVE', intensity: 2 }
                    }
                ]
            }
        ];
    }

    generateRandomEvents() {
        return [
            {
                name: "突发加班",
                type: "crisis",
                description: "公司突然有个紧急项目需要处理",
                choices: [
                    {
                        text: "提前告诉老婆并承诺补偿",
                        effect: { love: -5, mood: -5, trust: 5 },
                        waveAction: { type: 'NEUTRAL' }
                    },
                    {
                        text: "直接加班到很晚",
                        effect: { love: -15, mood: -20, trust: -10 },
                        waveAction: { type: 'NEGATIVE' }
                    }
                ]
            },
            {
                name: "异性同事示好",
                type: "crisis",
                description: "有异性同事总是对你特别热情",
                choices: [
                    {
                        text: "委婉拒绝并告诉老婆这件事",
                        effect: { love: 10, mood: 0, trust: 15 },
                        waveAction: { type: 'POSITIVE' }
                    },
                    {
                        text: "保持距离但不说",
                        effect: { love: 0, mood: 0, trust: -5 },
                        waveAction: { type: 'SUSPICIOUS' }
                    },
                    {
                        text: "接受对方好意",
                        effect: { love: -25, mood: -15, trust: -30 },
                        waveAction: { type: 'SUSPICIOUS', intensity: 2 }
                    }
                ]
            },
            {
                name: "意外惊喜",
                type: "positive",
                description: "你发现老婆最近一直在偷偷学习你喜欢的菜",
                choices: [
                    {
                        text: "表达感动并大力称赞",
                        effect: { love: 20, mood: 25, trust: 15 },
                        waveAction: { type: 'POSITIVE', intensity: 1.5 }
                    },
                    {
                        text: "平淡说声谢谢",
                        effect: { love: 5, mood: -5, trust: 0 },
                        waveAction: { type: 'NEUTRAL' }
                    }
                ]
            }
        ];
    }

    advanceDay() {
        this.currentDay++;
        if (this.currentDay > 30) {
            this.currentDay = 1;
            this.currentMonth++;
            if (this.currentMonth > 12) {
                this.currentMonth = 1;
            }
        }
        return this.checkEvents();
    }

    checkEvents() {
        // 检查是否有特殊日期事件
        const specialEvent = this.specialDates.find(
            date => date.day === this.currentDay && date.month === this.currentMonth
        );
        
        if (specialEvent) {
            return {
                type: 'special',
                event: specialEvent
            };
        }

        // 随机触发事件 (20%概率)
        if (Math.random() < 0.2) {
            const randomEvent = this.randomEvents[Math.floor(Math.random() * this.randomEvents.length)];
            return {
                type: 'random',
                event: randomEvent
            };
        }

        return null;
    }

    getDateString() {
        return `第${this.currentMonth}月 第${this.currentDay}天`;
    }
} 