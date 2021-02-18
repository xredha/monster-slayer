const getRandomValue = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      currentHeal : 5,
      winner: null,
      logs: [],
    }
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = 'draw';
      } else if (value <= 0) {
        this.winner = 'monster';
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = 'draw';
      } else if (value <= 0) {
        this.winner = 'player';
      }
    },
  },
  computed:{
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return {width: '0%'};
      }
      return {width: `${this.playerHealth}%`}
    },
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return {width: '0%'};
      }
      return {width: `${this.monsterHealth}%`}
    },
    useSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    disableHealing() {
      return this.currentHeal === 0;
    }
  },
  methods: {
    startNewGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.currentHeal = 5;
      this.winner = null;
      this.logs = [];
    },
    playerAttack() {
      this.currentRound++;
      const attack = getRandomValue(5, 12);
      this.logMessages('player', 'attack', attack);
      this.monsterHealth -= attack;
      this.monsterAttack();
    },
    monsterAttack() {
      const attack = getRandomValue(8, 15);
      this.logMessages('monster', 'attack', attack);
      this.playerHealth -= attack;
    },
    specialAttack() {
      this.currentRound++;
      const attack = getRandomValue(10, 25);
      this.logMessages('player', 'special-attack', attack);
      this.monsterHealth -= attack;
      this.monsterAttack();
    },
    healPlayer() {
      this.currentRound++;
      const heal = getRandomValue(15, 25);
      this.logMessages('player', 'heal', heal);
      if ((this.playerHealth + heal) > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += heal;
      }
      this.currentHeal--;
      this.monsterAttack();
    },
    surrender() {
      this.winner = 'monster';
    },
    logMessages(who, what, value) {
      this.logs.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    }
  }
})

app.mount('#game');