class Tower {
    damage;
    range;
    fireRate;
    target;
    position;
    interval;

    constructor(damage = 1, range = 1, fireRate = 1, position = [0, 0]) {
        this.damage = damage
        this.range = range
        this.fireRate = fireRate
        this.position = position

        this.interval = setInterval(() => {
            this.changeTarget()
            if (this.target) {
                this.attack()
            }
            console.table(this)
        }, 1000);
    }

    attack() {
        this.target.life -= this.damage
    }

    changeTarget() {
        const inRange = GameManager.getAllEnemies().filter((enemy) => {
            const distance = GameManager.calculatePointDistance(enemy.position, this.position)
            return Math.floor(distance) <= this.range
        })
        if (inRange.length > 0) {
            this.target = inRange[0]
        } else {
            this.target = null
        }
    }

    upgrade(){
        this.clearSelfInterval()
        delete this
        return new Tower2(2,2,2,this.position)
    }

    clearSelfInterval() {
        clearInterval(this.interval)
    }
}

class GameManager {

    static life;
    static enemies = [];

    constructor() {
        this.life = 100;
    }

    static getAllEnemies() {
        return this.enemies
    }

    static pushNewEnemy(enemy) {
        this.enemies.push(enemy)
    }

    static calculatePointDistance(a, b) {
        const distance = Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2))
        return distance
    }

    static decreaseLife() {
        this.life -= 10
    }
}

class Waypoints {

    static waypoints = [[10, 1], [10, 3], [1, 3], [1, 5], [10, 5], [10, 6]]

}

class Enemy {
    target;
    waypointNum = 0;
    life;
    position;
    speed = 1;
    interval;

    constructor(life = 10, position = [0, 0]) {
        const target = Waypoints.waypoints[0]
        this.target = [target[0], target[1]]
        this.life = life
        this.position = position
        GameManager.pushNewEnemy(this)

        this.interval = setInterval(() => {
            this.death()
            this.hitPlayer()
            if (this.waypointNum < Waypoints.waypoints.length) {
                this.changeTarget()
                this.move()
            } else {
                this.clearSelfInterval()
            }
        }, 1000);
    }

    clearSelfInterval() {
        clearInterval(this.interval)
    }

    changeTarget() {
        if (this.position[0] == this.target[0] && this.position[1] == this.target[1]) {
            this.waypointNum += 1
            const target = Waypoints.waypoints[this.waypointNum]
            this.target = [target[0], target[1]]
        }
    }

    death() {
        if (this.life == 0) {
            this.clearSelfInterval()
            delete this
        }
    }

    move() {
        if (this.position[0] == this.target[0]) {
            if (this.target[1] > this.position[1]) {
                this.position = [this.position[0], this.position[1] + this.speed]
            } else {
                this.position = [this.position[0], this.position[1] - this.speed]
            }
        } else {
            if (this.target[0] > this.position[0]) {
                this.position = [this.position[0] + this.speed, this.position[1]]
            } else {
                this.position = [this.position[0] - this.speed, this.position[1]]
            }
        }
    }

    hitPlayer() {
        if (this.position[0] == Waypoints.waypoints[Waypoints.waypoints.length - 1][0] && this.position[1] == Waypoints.waypoints[Waypoints.waypoints.length - 1][1]) {
            GameManager.decreaseLife()
            this.death()
        }
    }

}

class Tower2 extends Tower {
    constructor(damage = 1, range = 1, fireRate = 1, position = [0, 0]) {
        super(damage,range,fireRate,position);
    }
}

let game = new GameManager()
let enemy1 = new Enemy(10, [0, 1])
let tower1 = new Tower(1, 1, 1, [8, 2])
tower1 = tower1.upgrade()