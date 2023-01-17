class Card {
    value;
    name;
    suit;
    constructor(value, name, suit) {
        this.value = value;
        this.name = name;
        this.suit = suit;
    }
}

class Deck {
    suits = ["heart", "diamond", "club", "spades"];
    names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    deck = [];

    constructor() {
        let aux = [];
        this.names.forEach((name, idx) => {
            aux.push(new Card(idx+1, name, this.suits[0]));
            aux.push(new Card(idx+1, name, this.suits[1]));
            aux.push(new Card(idx+1, name, this.suits[2]));
            aux.push(new Card(idx+1, name, this.suits[3]));
        })
        this.deck = [...aux]
    }

    shuffle() {
        let aux = [...this.deck];
        for (let i = aux.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const teste = aux[i]
            aux[i] = aux[j]
            aux[j] = teste
            // [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
        this.deck = [...aux]
    }

    pickCard() {
        return this.deck.pop();
    }
}

class Player{
    hand = [];
    deck;

    constructor(deck){
        this.deck = deck;
    }

    pickCard(){
        this.hand.push(this.deck.pickCard())
    }
}

teste = new Deck()
teste.shuffle()
player = new Player(teste)
enemy = new Player(teste)
player.pickCard()
enemy.pickCard()
player.pickCard()
enemy.pickCard()
console.log(player.hand)
console.log(enemy.hand)
