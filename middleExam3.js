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
        this.errMsgs = {
            empty: function () {
                console.log("재고가 없습니다.");
            },
            available: function (availableDrink) {
                console.log("사용가능한 음료수  : " + availableDrink);
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
    VendingMachine.prototype.availableDrink = function (money) {
        var availableDrink = '';
        this.drinks.drinkArray.filter(function (drink) {
            return drink.price <= money;
        }).forEach(function (drink) {
            var price = drink.amount > 0 ? drink.price : "재고없음";
            availableDrink += drink.name + "(" + price + ") ";
        });
        if (availableDrink === '') {
            this.errMsgs.empty();
            return false;
        } else {
            this.errMsgs.available(availableDrink);
            return true;
        }
    };

    VendingMachine.prototype.selectDrink = function (money) {
        rl.question('선택하세요 : ', function (select) {
            var check = 0;
            var length = this.drinks.drinkArray.length;
            this.drinks.drinkArray.forEach(function (drink, index) {
                if (drink.name === select) {
                    if (drink.amount < 1) {
                        this.errMsgs.empty();
                        this.selectDrink(money);
                    } else {
                        drink.amount--;
                        this.errMsgs.select(select);
                        this.requestRepurchase(money - drink.price);
                    }
                    check++;
                }

                if (check === 0 && (length - 1) === index) {
                    this.errMsgs.prohibition();
                    this.selectDrink(money);
                }
            }.bind(this));
        }.bind(this));
    };

    VendingMachine.prototype.requestRepurchase = function (changes) {
        rl.question('다른걸 구매할까요? 반환할까요? ', function (answer) {
            if (answer === "반환") {
                this.errMsgs.changes(changes);
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
    Drinks.prototype.addDrink = function (name, price, amount) {
        var drink = new Drink(name, price, amount);
        this.drinkArray.push(drink);
    }
    Drinks.prototype.getDrinkPrice = function (name) {
        var price;
        this.drinkArray.filter(function (drink) {
            return drink.name === name;
        }).forEach(function (drink) {
            price = drink.price;
        });
        return price;
    }
    Drinks.prototype.bringDrink = function (name) {
        this.drinkArray.filter(function (drink) {
            return drink.name === name;
        }).forEach(function (drink) {
            drink.amount--;
        });
    }

    function Drink(name, price, amount) {
        this.name = name;
        this.price = price;
        this.amount = amount;
    };
    return Drinks;
})();

(function () {
    var drinkMachine = new VendingMachine();
    drinkMachine.drinks.addDrink("콜라", 1000, 5);
    drinkMachine.drinks.addDrink("사이다", 1000, 7);
    drinkMachine.drinks.addDrink("포도쥬스", 700, 2);
    drinkMachine.drinks.addDrink("딸기우유", 500, 1);
    drinkMachine.drinks.addDrink("미에로화이바", 900, 3);
    drinkMachine.drinks.addDrink("물", 500, 4);
    drinkMachine.drinks.addDrink("파워에이드", 800, 0);

    drinkMachine.insertCoin();
})();