class Achievements {
    constructor() {
        this.achievements = {
            perfect_husband: {
                name: "完美丈夫",
                description: "同时保持爱情、心情和信任值在90以上",
                unlocked: false,
                icon: "👑"
            },
            quantum_master: {
                name: "量子掌控者",
                description: "使开心状态概率达到80%以上",
                unlocked: false,
                icon: "🎯"
            },
            crisis_manager: {
                name: "危机管理大师",
                description: "从怀疑状态概率50%以上恢复到20%以下",
                unlocked: false,
                icon: "🛟"
            },
            anniversary_king: {
                name: "纪念日之王",
                description: "完美处理3次特殊日期事件",
                progress: 0,
                maxProgress: 3,
                unlocked: false,
                icon: "🎊"
            },
            lucky_survivor: {
                name: "幸运生还者",
                description: "成功化解3次随机危机事件",
                progress: 0,
                maxProgress: 3,
                unlocked: false,
                icon: "🍀"
            }
        };
    }

    checkAchievements(status, previousState) {
        const updates = [];

        // 检查完美丈夫成就
        if (status.love >= 90 && status.mood >= 90 && status.trust >= 90 
            && !this.achievements.perfect_husband.unlocked) {
            this.achievements.perfect_husband.unlocked = true;
            updates.push(this.achievements.perfect_husband);
        }

        // 检查量子掌控者成就
        if (status.probabilities.happy >= 0.8 && !this.achievements.quantum_master.unlocked) {
            this.achievements.quantum_master.unlocked = true;
            updates.push(this.achievements.quantum_master);
        }

        // 检查危机管理大师成就
        if (previousState && 
            previousState.probabilities.suspicious >= 0.5 &&
            status.probabilities.suspicious <= 0.2 &&
            !this.achievements.crisis_manager.unlocked) {
            this.achievements.crisis_manager.unlocked = true;
            updates.push(this.achievements.crisis_manager);
        }

        return updates;
    }

    updateProgress(type) {
        if (type === 'anniversary' && !this.achievements.anniversary_king.unlocked) {
            this.achievements.anniversary_king.progress++;
            if (this.achievements.anniversary_king.progress >= this.achievements.anniversary_king.maxProgress) {
                this.achievements.anniversary_king.unlocked = true;
                return this.achievements.anniversary_king;
            }
        } else if (type === 'crisis' && !this.achievements.lucky_survivor.unlocked) {
            this.achievements.lucky_survivor.progress++;
            if (this.achievements.lucky_survivor.progress >= this.achievements.lucky_survivor.maxProgress) {
                this.achievements.lucky_survivor.unlocked = true;
                return this.achievements.lucky_survivor;
            }
        }
        return null;
    }

    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }

    getAllAchievements() {
        return this.achievements;
    }
} 