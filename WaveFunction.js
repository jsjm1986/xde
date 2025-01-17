class WaveFunction {
    constructor() {
        // 初始化量子态的基向量
        this.baseStates = {
            HAPPY: 'happy',         // 开心态
            ANGRY: 'angry',         // 生气态
            NEUTRAL: 'neutral',     // 中性态
            SUSPICIOUS: 'suspicious' // 怀疑态
        };

        // 初始化波函数的振幅（概率幅）
        this.amplitudes = {
            [this.baseStates.HAPPY]: Math.sqrt(0.4),      // 40%概率
            [this.baseStates.ANGRY]: Math.sqrt(0.1),      // 10%概率
            [this.baseStates.NEUTRAL]: Math.sqrt(0.4),    // 40%概率
            [this.baseStates.SUSPICIOUS]: Math.sqrt(0.1)  // 10%概率
        };

        // 相位角（用于干涉效应）
        this.phases = {
            [this.baseStates.HAPPY]: 0,
            [this.baseStates.ANGRY]: Math.PI / 2,
            [this.baseStates.NEUTRAL]: Math.PI,
            [this.baseStates.SUSPICIOUS]: 3 * Math.PI / 2
        };

        // 状态纠缠度（影响状态转换的难度）
        this.entanglement = 0;
    }

    // 计算状态的概率
    getProbability(state) {
        const amplitude = this.amplitudes[state];
        return amplitude * amplitude;
    }

    // 更新量子态（通过外部干涉）
    updateState(action) {
        const interference = this.calculateInterference(action);
        const intensity = action.intensity || 1;
        
        // 更新振幅
        for (let state in this.baseStates) {
            const currentState = this.baseStates[state];
            const factor = Math.pow(interference[currentState], intensity);
            this.amplitudes[currentState] *= factor;
        }

        // 更新纠缠度
        this.updateEntanglement(action);

        // 归一化
        this.normalize();
    }

    // 计算干涉效应
    calculateInterference(action) {
        const interference = {};
        const entanglementFactor = 1 + (this.entanglement * 0.2); // 纠缠度影响因子

        for (let state in this.baseStates) {
            const currentState = this.baseStates[state];
            
            // 基于action计算干涉强度
            let factor = 1;
            switch(action.type) {
                case 'POSITIVE':
                    factor = currentState === this.baseStates.HAPPY ? 1.2 : 
                            currentState === this.baseStates.ANGRY ? 0.8 : 1;
                    break;
                case 'NEGATIVE':
                    factor = currentState === this.baseStates.ANGRY ? 1.2 :
                            currentState === this.baseStates.HAPPY ? 0.8 : 1;
                    break;
                case 'SUSPICIOUS':
                    factor = currentState === this.baseStates.SUSPICIOUS ? 1.3 : 0.9;
                    break;
                case 'NEUTRAL':
                    factor = currentState === this.baseStates.NEUTRAL ? 1.1 : 0.95;
                    break;
            }
            
            // 应用纠缠度影响
            factor = Math.pow(factor, entanglementFactor);
            interference[currentState] = factor;
        }
        return interference;
    }

    // 更新纠缠度
    updateEntanglement(action) {
        const entanglementChange = {
            'POSITIVE': -0.1,
            'NEGATIVE': 0.15,
            'SUSPICIOUS': 0.2,
            'NEUTRAL': -0.05
        }[action.type] || 0;

        this.entanglement = Math.max(0, Math.min(1, this.entanglement + entanglementChange));
    }

    // 归一化波函数
    normalize() {
        let totalProbability = 0;
        for (let state in this.baseStates) {
            const currentState = this.baseStates[state];
            totalProbability += this.getProbability(currentState);
        }

        const normalizationFactor = 1 / Math.sqrt(totalProbability);
        for (let state in this.baseStates) {
            const currentState = this.baseStates[state];
            this.amplitudes[currentState] *= normalizationFactor;
        }
    }

    // 获取当前最可能的状态
    getMostProbableState() {
        let maxProb = 0;
        let mostProbableState = null;

        for (let state in this.baseStates) {
            const currentState = this.baseStates[state];
            const prob = this.getProbability(currentState);
            if (prob > maxProb) {
                maxProb = prob;
                mostProbableState = currentState;
            }
        }

        return {
            state: mostProbableState,
            probability: maxProb,
            entanglement: this.entanglement
        };
    }

    // 获取所有状态的概率分布
    getStateProbabilities() {
        const probabilities = {};
        for (let state in this.baseStates) {
            const currentState = this.baseStates[state];
            probabilities[currentState] = this.getProbability(currentState);
        }
        return probabilities;
    }
} 