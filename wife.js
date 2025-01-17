class Wife {
    constructor() {
        // 属性的真实值是不确定的，只存储波函数
        this.attributes = {
            love: new QuantumAttribute('love', 100, 10),    // 初始均值100，标准差10
            mood: new QuantumAttribute('mood', 100, 10),
            trust: new QuantumAttribute('trust', 100, 10)
        };
        
        this.waveFunction = new WaveFunction();
        this.isCollapsed = false;
        this.lastMeasuredAttribute = null;  // 记录上次测量的属性
        this.measurementsToday = 0;         // 今天已测量次数
        this.events = this.generateEvents();
    }

    // 测量属性，会影响其他属性（测不准原理）
    measureAttribute(attributeName) {
        if (this.measurementsToday >= 1) {
            throw new Error('今天已经进行过测量了！');
        }

        const attribute = this.attributes[attributeName];
        if (!attribute) {
            throw new Error('无效的属性名');
        }

        // 测量会影响其他属性（不确定性原理）
        const measurement = attribute.measure();
        this.measurementsToday++;
        this.lastMeasuredAttribute = attributeName;

        // 测量导致其他属性的不确定性增加
        for (let name in this.attributes) {
            if (name !== attributeName) {
                this.attributes[name].increaseUncertainty();
            }
        }

        return measurement;
    }

    // 重置每日测量次数
    resetDailyMeasurements() {
        this.measurementsToday = 0;
        this.lastMeasuredAttribute = null;
    }

    // 更新状态（通过外部干涉）
    updateStatus(effect, waveAction) {
        // 更新波函数状态
        this.waveFunction.updateState(waveAction);
        
        // 通过效果影响属性的概率分布
        for (let attr in effect) {
            if (this.attributes[attr]) {
                this.attributes[attr].applyEffect(effect[attr]);
            }
        }

        // 检查是否游戏结束
        this.checkCollapse();
    }

    // 检查是否坍缩
    checkCollapse() {
        // 获取所有属性的崩溃概率
        const collapseProbabilities = {};
        for (let attr in this.attributes) {
            collapseProbabilities[attr] = this.attributes[attr].getCollapseProbability();
        }

        // 如果任何属性的崩溃概率超过阈值，或者怀疑状态过高，则发生坍缩
        const suspiciousProb = this.waveFunction.getStateProbabilities().suspicious;
        if (Object.values(collapseProbabilities).some(p => p > 0.7) || suspiciousProb > 0.6) {
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

    // 获取状态信息
    getStatus() {
        const waveState = this.waveFunction.getMostProbableState();
        const probabilities = this.waveFunction.getStateProbabilities();
        
        // 只返回最后测量的属性的具体值，其他属性返回不确定区间
        const attributes = {};
        for (let attr in this.attributes) {
            if (attr === this.lastMeasuredAttribute) {
                attributes[attr] = {
                    value: this.attributes[attr].getLastMeasurement(),
                    uncertainty: this.attributes[attr].getUncertainty(),
                    measured: true
                };
            } else {
                const range = this.attributes[attr].getUncertaintyRange();
                attributes[attr] = {
                    range: range,
                    uncertainty: this.attributes[attr].getUncertainty(),
                    measured: false
                };
            }
        }

        return {
            attributes: attributes,
            isCollapsed: this.isCollapsed,
            waveState: waveState.state,
            waveProbability: waveState.probability,
            probabilities: probabilities,
            entanglement: waveState.entanglement,
            measurementsToday: this.measurementsToday
        };
    }

    generateEvents() {
        return [
            {
                text: "测量爱情值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'love'
            },
            {
                text: "测量心情值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'mood'
            },
            {
                text: "测量信任值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'trust'
            },
            {
                text: "陪老婆逛街购物",
                effect: {
                    love: 10,
                    mood: 15,
                    trust: 5
                },
                waveAction: { type: 'POSITIVE' }
            },
            {
                text: "给老婆做一顿美食",
                effect: {
                    love: 15,
                    mood: 10,
                    trust: 5
                },
                waveAction: { type: 'POSITIVE' }
            },
            {
                text: "和老婆一起看电影",
                effect: {
                    love: 8,
                    mood: 12,
                    trust: 3
                },
                waveAction: { type: 'POSITIVE' }
            },
            {
                text: "加班到很晚",
                effect: {
                    love: -10,
                    mood: -15,
                    trust: -5
                },
                waveAction: { type: 'NEGATIVE' }
            },
            {
                text: "忘记结婚纪念日",
                effect: {
                    love: -20,
                    mood: -25,
                    trust: -15
                },
                waveAction: { type: 'NEGATIVE' }
            },
            {
                text: "和异性同事单独吃饭",
                effect: {
                    love: -15,
                    mood: -10,
                    trust: -20
                },
                waveAction: { type: 'SUSPICIOUS' }
            },
            {
                text: "深夜收到异性短信",
                effect: {
                    love: -10,
                    mood: -5,
                    trust: -15
                },
                waveAction: { type: 'SUSPICIOUS' }
            },
            {
                text: "送老婆惊喜礼物",
                effect: {
                    love: 20,
                    mood: 20,
                    trust: 10
                },
                waveAction: { type: 'POSITIVE' }
            }
        ];
    }
} 