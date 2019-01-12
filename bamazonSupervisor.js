var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var table = require("console.table")
var Table = require('cli-table')


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
    connection.query("SELECT * FROM departments GROUP BY department_id", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices: [
                    "View Products Sales By Department",
                    "Create New Department",
                ],
                message: "What would you like to do?"
            }])
            .then(function (answer) {

                switch (answer.choice) {
                    case "View Products Sales By Department":
                        viewProductSales();
                        break;
                    case "Create New Department":
                        createDepartment();
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

function viewProductSales() {
    var table = new Table({
        head: ['ID', 'Department', 'Over-head-cost', 'Product Sales', 'Total Profit'],
        colWidths: [10, 30, 30, 30, 30]
    });
    // var table = new Table();
    console.log("inside")
    var q = "SELECT department_id,departments.department_name,over_head_costs,IFNULL(SUM(price),0) AS product_sales,(IFNULL(SUM(price),0) - over_head_costs) AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_id"
    connection.query(q, function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {

            var id = results[i].department_id,
                name = results[i].department_name,
                cost = results[i].over_head_costs,
                sale = results[i].product_sales,
                profit = results[i].total_profit;


            // instantiate


            // table is an Array, so you can `push`, `unshift`, `splice` and friends
            table.push(
                [id, name, cost, sale, profit]
            );



        }
        console.log("-------------- ")
        console.log(table.toString());
        quit();
    });
}



function createDepartment() {
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: "Name the department you wish to add?",
                name: "departmentName"
            },

            {
                type: "input",
                message: "What are the overhead costs for this department?",
                name: "overHead"
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
                connection.query("INSERT INTO departments SET ?", {
                        department_name: answer.departmentName,
                        over_head_costs: answer.overHead

                    },
                    function (error) {
                        if (error) throw error;
                        console.log("\nYou added a new department " + chalk.blue(answer.departmentName), "with overHead costs: $", answer.overHead);
                        quit();
                    })

            } else {
                console.log("\nThat's okay  come again when you are more sure.\n");
            }
        });

}