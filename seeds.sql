USE bamazon_db;

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ('Diary Of A Whimpy Kid','Books',5.50,8),
       ('The Blue Lotus','Books',11.47,5),
       ('Smart TV','Electronics',500,10),
       ('Google Pixel 3',400,5),
       ('Printed T-Shirt White XL',25.50,100),
       ('Dark Blue Dress Size 4',100,20)
      ('Himalayan Salt Lamp','Home & Garden',45.99,10),
      ('Compost Bin','Home & Garden',21.00,3),
      ('Magnetic Drawing Board','Toys',24.99,45),
      ('Crayola Safety Scissors','Toys',3.29,3);

      USE bamazon_db;

INSERT INTO departments(department_name,over_head_costs,product_sales)
VALUES ('Books',1000),
	  ('Electronics',5000),
      ('Clothing',20000),
      ('Home & Garden',20000),
      ('Toys',10000)