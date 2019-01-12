var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var Table = require("cli-table")

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
                        addInventory();
                        break;
                    case "Add New Product":
                        addProduct();
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

            {
                type: "confirm",
                message: "Do you wish to quit:",
                name: "confirm",
                default: true
            }

        ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirm) {
                connection.end();
            } else {
                start();
            }
        });
}

function viewProducts() {
    var table = new Table({
        head: ['ID', 'Product Name'],
        colWidths: [10, 30]
    });
    connection.query("SELECT * FROM products GROUP BY item_id", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            // console.log(results[i].item_id, 
            //     results[i].product_name);
            var id = results[i].item_id,
                name = results[i].product_name;

            table.push(
                [id, name]
            );
        }
        console.log("-------------- ")
        console.log(table.toString());
        quit();
    });
}

function lowInventory() {
    var table = new Table({
        head: ['ID', 'Product Name', 'Quantity'],
        colWidths: [10, 30, 30]
    });
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {

            var id = results[i].item_id,
                name = results[i].product_name,
                quant = results[i].stock_quantity

            table.push(
                [id, name, quant])
        }
        console.log("-------------- ")
        console.log(table.toString());
        quit();
    });
}

function addInventory() {
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
                    message: "What product would you like add to?"
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
                        console.log("You added to", chalk.green.bold(chosenItem.product_name), ".Your stock quantity is", chalk.underline.bold(chosenItem.stock_quantity + parseInt(answer.quantity)), "now");
                        quit();
                    })


            });
    });

}

function addProduct() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: "What product do you wish to add?",
                name: "productName"
            },

            {
                type: "list",
                message: "Which department does this product belong to?",
                choices: ["Books", "Grocery", "Home & Gardenr", "Electronic", "Toys", "Miscellaneous"],
                name: "department"
            },
            {
                type: "input",
                message: "What is the price of this product?",
                name: "productPrice"
            },

            {
                type: "input",
                message: "How much do you wish to add?",
                name: "quantity",
                default: 0
            },
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Are you sure:",
                name: "confirm",
                default: true
            }
        ])
        .then(function (answer) {
            // If the answer confirms, we displays the answer's username and pokemon from the answers.
            if (answer.confirm) {
                connection.query("INSERT INTO products SET ?", {
                        product_name: answer.productName,
                        department_name: answer.department,
                        price: answer.productPrice,
                        stock_quantity: answer.quantity

                    },
                    function (error) {
                        if (error) throw error;
                        console.log("\nYou added " + chalk.blue(answer.productName), "to", answer.department);
                        quit();
                    })

            } else {
                console.log("\nThat's okay come again when you are more sure.\n");
            }
        });

}