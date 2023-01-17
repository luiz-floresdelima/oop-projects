class Character {
    equipmentHead;
    equipmentChest;
    equipmentLeg;
    equipmentHand;
    equipmentFoot;
    equipmentOffHand;
    equipmentWeapon;
    bag;
    damage;
    defense;
    critChance;
    life;
    level;
    expBar;
    target;

    #helper = {
        "head": () => {
            return this.equipmentHead
        },
        "chest": () => {
            return this.equipmentChest
        },
        "leg": () => {
            return this.equipmentLeg
        },
        "hand": () => {
            return this.equipmentHand
        },
        "foot": () => {
            return this.equipmentFoot
        },
        "offhand": () => {
            return this.equipmentOffHand
        },
        "weapon": () => {
            return this.equipmentWeapon
        }
    }

    constructor(typoChar = 0, level = 1) {
        if (typoChar) {
            this.equipmentOffHand = new Offhand();
            this.equipmentWeapon = new Weapon();
        } else {
            this.equipmentOffHand = new Equipment();
            this.equipmentWeapon = new Equipment();
        }
        this.equipmentHead = new Equipment()
        this.equipmentChest = new Equipment();
        this.equipmentLeg = new Equipment();
        this.equipmentHand = new Equipment();
        this.equipmentFoot = new Equipment();
        this.bag = [];
        this.level = level;
        this.damage = this.level;
        this.defense = 0;
        this.critChance = 0;
        this.expBar = 0;
        this.life = this.level * 10;
        this.target = null;
    }

    equip(slot, equipment) {
        const index = this.bag.indexOf(equipment);
        if (index > -1) {
            this.bag.splice(index, 1);
        }

        this.#helper[`${slot}`]() = equipment;
    }

    unequip(slot) {
        const item = this.#helper[`${slot}`]()
        this.#helper[`${slot}`]() = null
        this.bag.push(item)
    }

    pickItem(item) {
        this.bag.push(item)
    }

    dropItem(item) {
        const index = this.bag.indexOf(item);
        if (index > -1) {
            this.bag.splice(index, 1);
        }
    }

    #dropAllItems() {
        let itens = [...this.bag]
        this.bag = []
        return itens
    }

    attack() {
        this.target.calculateDamageReceived(this.calculateFinalDamageDeal())
    }

    calculateFinalDamageDeal() {
        const mutiplierCrit = Math.random() < this.critChance ? 2 : 1;
        return (this.damage + this.equipmentWeapon.damage + this.equipmentOffHand.damage) * mutiplierCrit
    }

    calculateDamageReceived(damage) {
        const allDefense = this.defense + this.equipmentHead.defense + this.equipmentChest.defense + this.equipmentLeg.defense + this.equipmentHand.defense + this.equipmentFoot.defense;
        if (allDefense < damage) {
            this.life -= (damage - allDefense)
        }
    }

    setNewTarget(target) {
        this.target = target
    }

    onDeath() {
        return this.#dropAllItems()
        delete this
    }
}

class Player extends Character {

    constructor() {
        super(1)
    }
}

class Enemy extends Character {

    constructor(level = 1) {
        super(0, level)
    }
}

class Equipment {

    damage;
    defense;
    critChance;

    #helperMaterial = {
        "wood": {
            "damage": 1,
            "defense": 1,
            "critChance": 2
        },
        "iron": {
            "damage": 3,
            "defense": 3,
            "critChance": 5
        }
    }

    constructor(damage = 0, defense = 0, critChance = 0, material = "wood") {
        this.damage = (damage * this.#helperMaterial[`${material}`].damage);
        this.defense = (defense * this.#helperMaterial[`${material}`].defense);;
        this.critChance = (critChance * this.#helperMaterial[`${material}`].critChance);;
    }

}

class Helmet extends Equipment {
    constructor(material) {
        super(0, 1, 0)
    }
}

class Platebody extends Equipment {
    constructor(material) {
        super(0, 3, 0)
    }
}

class Platelegs extends Equipment {
    constructor(material) {
        super(0, 2, 0)
    }
}

class Glove extends Equipment {
    constructor(material) {
        super(0, 1, 0)
    }
}

class Boots extends Equipment {
    constructor(material) {
        super(0, 1, 0)
    }
}

class Offhand extends Equipment {
    constructor(material) {
        super(1, 1, 0)
    }
}

class Weapon extends Equipment {
    constructor(material) {
        super(2, 0, 3)
    }
}

class Drop {
    drops;

    constructor(drops = []) {
        this.drops = drops
    }
}

class GameManager {

    player;
    enemy;
    interval;
    turn;
    characterTurn;
    static drop;

    constructor() {
        this.drop = new Drop();

        this.turn = true;
        this.player = new Player()
        this.enemy = new Enemy()
        this.player.setNewTarget(this.enemy)
        this.enemy.setNewTarget(this.player)

        this.intervalUpdate()
    }

    intervalUpdate() {
        this.interval = setInterval(() => {
            if(this.turn){
                this.characterTurn = this.player;
            }else{
                this.characterTurn = this.enemy;
            }
            this.characterTurn.attack()
            console.log(this.characterTurn)
            if(this.characterTurn.target.life <= 0){
                this.drop = this.characterTurn.onDeath()
                clearInterval(this.interval)
            }

            this.turn = !this.turn
        }, 1000);
    }
}

game = new GameManager()