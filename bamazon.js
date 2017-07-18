var mysql=require("mysql");
var inquirer=require("inquirer");
var cart=[];
var options=[
  "Shop",
  "See statistics"
  ];
var questions=[
    {
        type: "list",
        message: "Select from the options below",
        choices: options,
        name: "option"
    }
];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) {
        console.log(err);
        return;
    }
   inquirer.prompt(questions).then(function (answers) {
        console.log(answers.option);
        switch(answers.option) 
        {
            case "Shop":
                BuyProduct();
            break;
            case "See statistics":
                Statistics();
            break;
          
        }
}); 
    
});

function BuyProduct(){
    var sql = 'select * from products order by department_name;';
    var questions=[
        {
        type: "input",
        message: "Enter Item number",
        name: "item"
        },
        {
        type: "input",
        message: "Enter quantity",
        name: "qty"
        }
    ];
    connection.query(sql, function(err, res){
        if(err){
            console.log(err);
            connection.end();
        }
        display(res);
        inquirer.prompt(questions).then(function (answers) {
            Buy(answers.item,answers.qty);
            });
    });   
}

function Buy(itemID,quantity)
{
var sql = 'update products set Stock=Stock-?, sold=sold+? where ID=?';
var value=[quantity,quantity,itemID];
//console.log(mysql.format(sql, value));
    connection.query(sql,value, function(err, res){
        if(err){
            console.log(err);
            connection.end();
        }
        cart.push(quantity + " item(s) of "+ itemID + ", ");

        var moreShopping={
            type: "confirm",
        message: "Want to shop more?",
        choices: options,
        name: "more"
        };
        inquirer.prompt(moreShopping).then(function (answers) {
            if(answers.more)
            {
                BuyProduct();
            }
            else
            {   
                var c=cart.join();
                c=c+" will be shipped to you soon.";
                console.log(c);
                connection.end();
            }
        });

       // 
    });
}

function Statistics(artist){
    var sql='select department_name, sum(price*sold) as total_sales from products group by department_name order by total_sales desc;';
    connection.query(sql, function(err, res){
        if(err){
            console.log(err);
            connection.end();
        }
        console.log("\n Higest Grossing Departments \n-----------------------------\n")
        for(var i=0; i<res.length; i++)
        {   
            console.log(res[i].department_name+"  --- Total_Sales: "+ res[i].total_sales);
        }
        connection.end();
    });
    
}


function display(res)
{
    for(var i=0; i<res.length; i++)
    {
        console.log("ID:" +res[i].ID+"  || ITEM: "+ res[i].Item_Name +"  || DEPARTMENT: "+ res[i].department_name+"  || PRICE: "+ res[i].Price+"  || STOCK: "+ res[i].Stock);
    }
}

function getDepartments()
{
    
    
    
}
