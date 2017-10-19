"use strict";
var rl = (function () {
    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return rl;
})();

Number.isNaN = Number.isNaN || function (value) {
    return value !== value;
}
var VendingMachine = (function () {
    function VendingMachine() {
        this.drinks = new Drinks();
        this.fund = 0;
        this.messages = {
            empty: function () {
                console.log("재고가 없습니다.");
            },
            notAvailable: function () {
                console.log("구매가능한 음료수가 없습니다.");
            },
            available: function (availableDrink) {
                console.log("구매가능한 음료수  : " + availableDrink);
            },
            select: function (select) {
                console.log(select + "가 나왔습니다.");
            },
            prohibition: function () {
                console.log("선택할 수 없습니다.");
            },
            changes: function (changes) {
                console.log("잔액은 " + changes + "원입니다.");
            }
        };
    }
    VendingMachine.prototype.insertCoin = function () {
        rl.question('동전을 넣으세요 : ', function (money) {
            this.availableDrink(money) ? this.selectDrink(money) : this.requestRepurchase(money);
        }.bind(this));
    };
    VendingMachine.prototype.addDrink = function (name, price, amount) {
        this.drinks.addDrink(name, price, amount);
    };
    VendingMachine.prototype.availableDrink = function (money) {
        var availableDrink = '';
        this.drinks.drinkArray.filter(function (drink) {
            return drink.price <= money;
        }).forEach(function (drink) {
            var price = drink.amount > 0 ? drink.price : "재고없음";
            availableDrink += drink.name + "(" + price + ") ";
        });
        if (availableDrink === '') {
            this.messages.notAvailable();
            return false;
        } else {
            this.messages.available(availableDrink);
            return true;
        }
    };

    VendingMachine.prototype.selectDrink = function (money) {
        rl.question('선택하세요 : ', function (select) {
            var selectedDrink = this.bringDrink(select);

            if (!selectedDrink) {
                this.messages.prohibition();
                this.selectDrink(money);
            } else {
                if (selectedDrink.amount < 1) {
                    this.messages.empty();
                    this.selectDrink(money);
                } else if (selectedDrink.amount >= 1) {
                    selectedDrink.amount--;
                    this.messages.select(select);
                    this.requestRepurchase(money - selectedDrink.price);
                }
            }
        }.bind(this));
    };
    VendingMachine.prototype.bringDrink = function (select) {
        var selectedDrink;
        selectedDrink = this.drinks.drinkArray.filter(function (drink) {
            return drink.name === select;
        });
        return selectedDrink[0];
    }

    VendingMachine.prototype.requestRepurchase = function (changes) {
        rl.question('다른걸 구매할까요? 반환할까요? ', function (answer) {
            if (answer === "반환") {
                this.messages.changes(changes);
                rl.close();
            } else if (!Number.isNaN(parseInt(answer))) {
                this.availableDrink(changes) ? this.selectDrink(changes) : this.requestRepurchase(changes);
            } else {
                this.requestRepurchase(changes);
            }
        }.bind(this));
    };
    return VendingMachine;
})();

var Drinks = (function () {
    function Drinks() {
        this.drinkArray = [];
    }

    function Drink(name, price, amount) {
        this.name = name;
        this.price = price;
        this.amount = amount;
    }

    Drinks.prototype.addDrink = function (name, price, amount) {
        var drink = new Drink(name, price, amount);
        this.drinkArray.push(drink);
    }
    return Drinks;
})();

(function () {
    var drinkMachine = new VendingMachine();
    drinkMachine.addDrink("콜라", 1000, 5);
    drinkMachine.addDrink("사이다", 1000, 7);
    drinkMachine.addDrink("포도쥬스", 700, 2);
    drinkMachine.addDrink("딸기우유", 500, 1);
    drinkMachine.addDrink("미에로화이바", 900, 3);
    drinkMachine.addDrink("물", 500, 4);
    drinkMachine.addDrink("파워에이드", 800, 0);

    drinkMachine.insertCoin();
})();