var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require('chalk');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    viewProducts();
    console.log("connected")
});


function viewProducts() {
    connection.query("SELECT * FROM products GROUP BY item_id", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on

        for (var i = 0; i < results.length; i++) {
            console.log(results[i].item_id, '|', results[i].product_name, '|', "$", results[i].price);
        }
        buyProduct();
    });
}

function buyProduct() {
    inquirer
        .prompt([{
                name: "idChoice",
                type: "input",
                message: "Enter ID of product would you like to buy?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How much would you like to buy?"
            }
        ])
        .then(function (answer) {
            // get the information of the chosen item
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === parseInt(answer.idChoice)) {
                        chosenItem = res[i];
                    }
                }

                // // determine if the quantity is present
                if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
                    console.log("Your order has been placed successfully")
                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                                stock_quantity: (chosenItem.stock_quantity - parseInt(answer.quantity))
                            },
                            {
                                item_id: answer.idChoice
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log(chalk.bgBlue("Thank you for your business."), " Your total is", chalk.underline.bold(" $", (answer.quantity * chosenItem.price)));;
                            quit();
                        })
                } else {
                    console.log("Sorry", chalk.bgRed("insufficient quantity"), "We only have", chalk.underline.bold(chosenItem.stock_quantity), "of", chalk.underline.bold(chosenItem.product_name), "available")
                    quit();
                }
            })

        });
}

function quit() {
    inquirer
        .prompt([{
                type: "confirm",
                message: "Do you wish to purchase more items:",
                name: "confirm",
                default: true
            }


        ])
        .then(function (inquirerResponse) {
            // If the inquirerResponse confirms, we continue else end connection.
            if (inquirerResponse.confirm) {
                viewProducts();
            } else {
                connection.end();

            }
        });
}