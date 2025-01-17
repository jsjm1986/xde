class Game {
    constructor() {
        this.wife = new Wife();
        this.eventSystem = new EventSystem();
        this.achievements = new Achievements();
        this.previousState = null;
        this.dailyChoiceMade = false;
        this.initialize();
    }

    initialize() {
        this.updateUI();
        this.generateOptions();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('nextDay').addEventListener('click', () => this.advanceDay());
        document.getElementById('showAchievements').addEventListener('click', () => this.showAchievements());
    }

    updateUI() {
        const status = this.wife.getStatus();
        
        // 更新属性显示
        this.updateAttributeDisplay('love', status.attributes.love);
        this.updateAttributeDisplay('mood', status.attributes.mood);
        this.updateAttributeDisplay('trust', status.attributes.trust);
        document.getElementById('entanglementBar').style.width = `${status.entanglement * 100}%`;

        // 更新日期显示
        document.getElementById('dateDisplay').textContent = this.eventSystem.getDateString();

        // 更新状态显示
        const wifeStatus = document.getElementById('wifeStatus');
        const wifeImage = document.getElementById('wifeImage');
        
        if (status.isCollapsed) {
            wifeStatus.textContent = '状态: 波函数坍缩（游戏结束）';
            wifeImage.textContent = '💔';
            document.getElementById('gameMessage').textContent = '你的老婆已经不再爱你了！游戏结束！';
            document.getElementById('options').innerHTML = `
                <button class="option-button" onclick="location.reload()">重新开始</button>
            `;
            document.getElementById('nextDay').disabled = true;
        } else {
            const stateEmoji = this.getStateEmoji(status.waveState);
            const probability = Math.round(status.waveProbability * 100);
            wifeStatus.textContent = `状态: ${stateEmoji} ${this.getStateText(status.waveState)} (${probability}%)`;
            this.updateWifeEmoji(status);
            
            // 显示量子态概率分布
            const probMessage = Object.entries(status.probabilities)
                .map(([state, prob]) => `${this.getStateEmoji(state)}: ${Math.round(prob * 100)}%`)
                .join(' | ');
            
            // 添加每日测量状态提示
            const measurementStatus = status.measurementsToday > 0 ? 
                '今日已进行测量' : 
                '今日尚未进行测量';
            document.getElementById('gameMessage').textContent = 
                `量子态分布: ${probMessage}\n${measurementStatus}`;

            // 更新下一天按钮状态
            const nextDayButton = document.getElementById('nextDay');
            nextDayButton.disabled = !this.dailyChoiceMade;
            nextDayButton.title = this.dailyChoiceMade ? 
                '进入下一天' : 
                '请先做出今天的选择';
        }

        // 检查成就
        const newAchievements = this.achievements.checkAchievements(status, this.previousState);
        if (newAchievements.length > 0) {
            this.showAchievementUnlock(newAchievements);
        }

        this.previousState = status;
    }

    updateAttributeDisplay(attrName, attrData) {
        const bar = document.getElementById(`${attrName}Bar`);
        const label = bar.parentElement.previousElementSibling;
        
        if (attrData.measured) {
            // 显示具体测量值
            bar.style.width = `${attrData.value}%`;
            label.textContent = `${this.getAttributeLabel(attrName)}: ${Math.round(attrData.value)} ±${Math.round(attrData.uncertainty)}`;
            bar.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
        } else {
            // 显示不确定区间
            const range = attrData.range;
            const width = range.max - range.min;
            bar.style.width = `${width}%`;
            bar.style.marginLeft = `${range.min}%`;
            label.textContent = `${this.getAttributeLabel(attrName)}: ${Math.round(range.min)}-${Math.round(range.max)} (未测量)`;
            bar.style.background = 'linear-gradient(90deg, #95a5a6, #7f8c8d)';
        }
    }

    getAttributeLabel(attr) {
        const labels = {
            love: '爱情值',
            mood: '心情值',
            trust: '信任值'
        };
        return labels[attr] || attr;
    }

    generateOptions() {
        if (this.wife.isCollapsed) return;

        const eventPanel = document.getElementById('eventPanel');
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        if (this.dailyChoiceMade) {
            eventPanel.classList.remove('active');
            optionsContainer.innerHTML = '<div class="daily-choice-message">今日已经做出选择，请点击"进入下一天"继续</div>';
            return;
        }

        // 检查是否有特殊事件
        const currentEvent = this.eventSystem.checkEvents();
        if (currentEvent) {
            eventPanel.classList.add('active');
            document.getElementById('eventTitle').textContent = currentEvent.event.name || '';
            document.getElementById('eventDescription').textContent = currentEvent.event.description || '';

            currentEvent.event.choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = choice.text;
                button.onclick = () => {
                    this.handleChoice(choice);
                    if (currentEvent.type === 'special') {
                        this.achievements.updateProgress('anniversary');
                    } else if (currentEvent.event.type === 'crisis') {
                        this.achievements.updateProgress('crisis');
                    }
                };
                optionsContainer.appendChild(button);
            });
        } else {
            eventPanel.classList.remove('active');
            const events = this.wife.getRandomEvents();
            events.forEach(event => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = event.text;
                
                if (event.isMeasurement && this.wife.measurementsToday > 0) {
                    button.disabled = true;
                    button.title = '今天已经进行过测量了';
                }

                button.onclick = () => {
                    if (event.isMeasurement) {
                        try {
                            const measurement = this.wife.measureAttribute(event.measureAttribute);
                            this.showMeasurementResult(event.measureAttribute, measurement);
                        } catch (error) {
                            alert(error.message);
                            return;
                        }
                    }
                    this.handleChoice(event);
                };
                optionsContainer.appendChild(button);
            });
        }
    }

    showMeasurementResult(attribute, value) {
        const notification = document.createElement('div');
        notification.className = 'measurement-notification';
        notification.innerHTML = `
            <div class="measurement-title">测量结果</div>
            <div class="measurement-value">${this.getAttributeLabel(attribute)}: ${Math.round(value)}</div>
            <div class="measurement-note">测量导致其他属性的不确定性增加</div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    handleChoice(event) {
        if (this.dailyChoiceMade) return;
        
        if (!event.isMeasurement) {
            this.wife.updateStatus(event.effect, event.waveAction);
        }
        
        this.dailyChoiceMade = true;
        this.updateUI();
        this.generateOptions();
    }

    advanceDay() {
        if (!this.dailyChoiceMade && !this.wife.isCollapsed) {
            alert('请先做出今天的选择！');
            return;
        }
        this.dailyChoiceMade = false;
        this.wife.resetDailyMeasurements();
        this.eventSystem.advanceDay();
        this.generateOptions();
        this.updateUI();
    }

    showAchievementUnlock(achievements) {
        achievements.forEach(achievement => {
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">解锁成就：${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        });
    }

    getStateEmoji(state) {
        const emojiMap = {
            'happy': '😊',
            'angry': '😠',
            'neutral': '😐',
            'suspicious': '🤨'
        };
        return emojiMap[state] || '🤔';
    }

    getStateText(state) {
        const textMap = {
            'happy': '开心',
            'angry': '生气',
            'neutral': '平静',
            'suspicious': '怀疑'
        };
        return textMap[state] || '未知';
    }

    updateWifeEmoji(status) {
        const wifeImage = document.getElementById('wifeImage');
        const waveState = status.waveState;
        const probability = status.waveProbability;

        if (waveState === 'happy' && probability > 0.6) {
            wifeImage.textContent = '😍';
        } else if (waveState === 'angry' && probability > 0.6) {
            wifeImage.textContent = '😡';
        } else if (waveState === 'suspicious' && probability > 0.4) {
            wifeImage.textContent = '🧐';
        } else {
            wifeImage.textContent = '🤔';
        }
    }

    showAchievements() {
        const achievementsPanel = document.getElementById('achievementsPanel');
        const achievementsList = document.getElementById('achievementsList');
        achievementsList.innerHTML = '';

        const allAchievements = this.achievements.getAllAchievements();
        for (let key in allAchievements) {
            const achievement = allAchievements[key];
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    ${achievement.progress !== undefined ? 
                        `<div class="achievement-progress">进度: ${achievement.progress}/${achievement.maxProgress}</div>` : 
                        ''}
                </div>
            `;
            achievementsList.appendChild(achievementElement);
        }

        achievementsPanel.classList.remove('hidden');
    }
}

// 启动游戏
window.onload = () => {
    new Game();
}; 