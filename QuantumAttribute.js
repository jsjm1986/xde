class QuantumAttribute {
    constructor(name, initialMean, initialUncertainty) {
        this.name = name;
        this.mean = initialMean;
        this.uncertainty = initialUncertainty;
        this.lastMeasurement = null;
        this.measurementHistory = [];
    }

    // 测量属性，返回一个具体值
    measure() {
        // 根据高斯分布生成测量值
        const measurement = this.gaussianRandom(this.mean, this.uncertainty);
        this.lastMeasurement = Math.max(0, Math.min(100, measurement));
        
        // 测量会影响平均值（测量导致的波函数坍缩）
        this.mean = this.lastMeasurement;
        
        // 测量后不确定性暂时降低
        this.uncertainty = Math.max(5, this.uncertainty * 0.7);
        
        this.measurementHistory.push({
            value: this.lastMeasurement,
            uncertainty: this.uncertainty,
            timestamp: Date.now()
        });

        return this.lastMeasurement;
    }

    // 增加不确定性（当测量其他属性时）
    increaseUncertainty() {
        this.uncertainty = Math.min(30, this.uncertainty * 1.3);
    }

    // 自然增加不确定性（随时间推移）
    naturalUncertaintyIncrease() {
        this.uncertainty = Math.min(30, this.uncertainty * 1.1);
    }

    // 应用效果（通过事件）
    applyEffect(effect) {
        this.mean = Math.max(0, Math.min(100, this.mean + effect));
        // 效果会稍微增加不确定性
        this.uncertainty = Math.min(30, this.uncertainty * 1.1);
    }

    // 获取最后的测量值
    getLastMeasurement() {
        return this.lastMeasurement;
    }

    // 获取当前不确定性
    getUncertainty() {
        return this.uncertainty;
    }

    // 获取当前可能的值范围
    getUncertaintyRange() {
        const min = Math.max(0, this.mean - this.uncertainty * 2);
        const max = Math.min(100, this.mean + this.uncertainty * 2);
        return { min, max };
    }

    // 获取崩溃概率（当属性接近临界值时）
    getCollapseProbability() {
        const range = this.getUncertaintyRange();
        if (range.min < 20) {
            return (20 - range.min) / 20;
        }
        return 0;
    }

    // 高斯随机数生成器
    gaussianRandom(mean, standardDeviation) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        
        const normal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + standardDeviation * normal;
    }
} 