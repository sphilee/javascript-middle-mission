"use strict";


var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function Drink(name, price, amount) {
    this.name = name;
    this.price = price;
    this.amount = amount;
};

var drinks = [new Drink("콜라", 1000, 5), new Drink("사이다", 1000, 7), new Drink("포도쥬스", 700, 2), new Drink("딸기우유", 500, 1), new Drink("미에로화이바", 900, 3), new Drink("물", 500, 4), new Drink("파워에이드", 800, 0)];

var errMsgs = {
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

function vendingMachine() {
    rl.question('동전을 넣으세요 : ', function (money) {
        availableDrink(money) ? selectDrink(money) : requestRepurchase(money);
    });
}

function availableDrink(money) {
    var availableDrink = '';
    drinks.filter(function (drink) {
        return drink.price <= money;
    }).forEach(function (drink) {
        var price = drink.amount > 0 ? drink.price : "재고없음";
        availableDrink += drink.name + "(" + price + ") ";
    });
    if (availableDrink === '') {
        errMsgs.empty();
        return false;
    } else {
        errMsgs.available(availableDrink);
        return true;
    }
}

function selectDrink(money) {
    rl.question('선택하세요 : ', function (select) {
        var check = 0;
        var length = drinks.length;
        drinks.forEach(function (drink, index) {
            if (drink.name === select) {
                if (drink.amount < 1) {
                    errMsgs.empty();
                    selectDrink(money);
                } else {
                    drink.amount--;
                    errMsgs.select(select);
                    requestRepurchase(money - drink.price);
                }
                check++;
            }

            if (check === 0 && (length - 1) === index) {
                errMsgs.prohibition();
                selectDrink(money);
            }
        });
    });
}

function requestRepurchase(changes) {
    rl.question('다른걸 구매할까요? 반환할까요? ', function (answer) {
        if (answer === "반환") {
            errMsgs.changes(changes);
            rl.close();
        } else if (!Number.isNaN(parseInt(answer))) {
            availableDrink(changes) ? selectDrink(changes) : requestRepurchase(changes);
        } else {
            requestRepurchase(changes);
        }
    });
}

vendingMachine();