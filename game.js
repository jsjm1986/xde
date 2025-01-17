class Game {
    constructor() {
        this.wife = new Wife();
        this.initialize();
    }

    initialize() {
        this.updateUI();
        this.generateOptions();
    }

    updateUI() {
        const status = this.wife.getStatus();
        
        // 更新进度条
        document.getElementById('loveBar').style.width = `${status.love}%`;
        document.getElementById('moodBar').style.width = `${status.mood}%`;
        document.getElementById('trustBar').style.width = `${status.trust}%`;

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
        } else {
            wifeStatus.textContent = '状态: 波函数未坍缩';
            this.updateWifeEmoji(status);
        }
    }

    updateWifeEmoji(status) {
        const wifeImage = document.getElementById('wifeImage');
        if (status.love > 80 && status.mood > 80 && status.trust > 80) {
            wifeImage.textContent = '😍';
        } else if (status.love > 60 && status.mood > 60 && status.trust > 60) {
            wifeImage.textContent = '😊';
        } else if (status.love > 40 && status.mood > 40 && status.trust > 40) {
            wifeImage.textContent = '😐';
        } else {
            wifeImage.textContent = '😢';
        }
    }

    generateOptions() {
        if (this.wife.isCollapsed) return;

        const events = this.wife.getRandomEvents();
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        events.forEach(event => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = event.text;
            button.onclick = () => this.handleChoice(event);
            optionsContainer.appendChild(button);
        });
    }

    handleChoice(event) {
        this.wife.updateStatus(event.effect);
        this.updateUI();
        
        if (!this.wife.isCollapsed) {
            this.generateOptions();
        }
    }
}

// 启动游戏
window.onload = () => {
    new Game();
}; 