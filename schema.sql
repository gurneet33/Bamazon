DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL ,
  price DECIMAL(8,2) DEFAULT 0.00,
  stock_quantity INT DEFAULT 0
);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL ,
  over_head_costs DECIMAL(8,2) DEFAULT 0.00
);


