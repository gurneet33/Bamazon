var mysql = require("mysql");
var inquirer = require("inquirer");

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
    start();
    console.log("connected")
});

function start() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products GROUP BY item_id", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: ["View Products for Sale",

                        "View Low Inventory",

                        "Add to Inventory",

                        "Add New Product"
                    ],
                    message: "What would you like to do?"
                }



            ])
            .then(function (answer) {

                switch (answer.choice) {
                    case "View Products for Sale":
                        viewProducts();
                        break;
                    case "View Low Inventory":
                        lowInventory();
                        break;
                    case "Add to Inventory":
                        updateInventory();
                        break;
                    case "Add New Product":
                        // code block
                        break;
                    default:
                        // code block
                }


            });
    });
}


function quit() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.

            {
                type: "confirm",
                message: "DO you wish to quit:",
                name: "confirm",
                default: true
            }
            // Here we create a basic password-protected text prompt.

        ])
        .then(function (inquirerResponse) {
            // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
            if (inquirerResponse.confirm) {
                connection.end();
            } else {
                start();
            }
        });
}

function viewProducts() {
    connection.query("SELECT * FROM products GROUP BY item_id", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on

        for (var i = 0; i < results.length; i++) {
            console.log(results[i].item_id, results[i].product_name);
        }

    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on

        for (var i = 0; i < results.length; i++) {
            console.log(results[i].item_id, results[i].product_name);
        }

    });
}

function updateInventory() {
    connection.query("SELECT * FROM products GROUP BY item_id", function (err, results) {
        inquirer
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What product would you like to buy?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How much would you like to add?"
                }
            ]).then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }

                // // determine if the quantity is present
                connection.query("UPDATE products SET ? WHERE ?",
                    [{
                            stock_quantity: (chosenItem.stock_quantity + parseInt(answer.quantity))
                        },
                        {
                            product_name: answer.choice
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("done");
                        quit();
                    })


            });
    });

}

function updateInventory() {
    connection.query("SELECT * FROM products GROUP BY item_id", function (err, results) {
        inquirer
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What product would you like to buy?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How much would you like to add?"
                }
            ]).then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }

                // // determine if the quantity is present
                connection.query("INSERT INTO products SET ? WHERE ?",
                    [{
                            stock_quantity: (chosenItem.stock_quantity + parseInt(answer.quantity))
                        },
                        {
                            product_name: answer.choice
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Done");
                        quit();
                    })


            });
    });

}