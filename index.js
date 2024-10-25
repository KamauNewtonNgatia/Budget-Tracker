import fs from "fs";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();
program
  .name("BudgetTracker")
  .description("A CLI utility for tracking one's budget")
  .version("1.0.0");

//Add item
program
  .command("new")
  .description("Adds a new item")
  .option("-t, --title <value>", "title of the new item to be added")
  .option("-q, --quantity <value>", "quantity of the new item to be added")
  .option("-p, --unitPrice <value>", "price per unit")
  .action(function (options) {
    const title = options.title;
    const quantity = options.quantity;
    const unitPrice = options.unitPrice;

    const newItem = {
      title,
      quantity,
      unitPrice,
      createdAt: new Date(),
      lastUpdateAt: new Date(),
    };

    const loadedItems = fs.readFileSync("./data/items.json", "utf8");
    let items;
    if (!loadedItems) {
      items = [];
    }
    items = JSON.parse(loadedItems);

    const itemExists = items.find((currentItem) => currentItem.title === title);
    if (itemExists) {
      console.log(chalk.bgRed(`Item with that title ${title} already exists`));
      return;
    }

    items.push(newItem);

    fs.writeFileSync("./data/items.json", JSON.stringify(items));
    console.log(chalk.bgGreen("New item added successfully!"));
  });

//Get items
program
  .command("getItems")
  .description("Display all items")
  .option("-t, --title </value>", "Title of the item you want to get")
  .action(function (options) {
    const title = options.title;
    const loadedItems = fs.readFileSync("./data/items.json", "utf8");
    const items = JSON.parse(loadedItems);

    if (items.length === 0) {
      console.log(chalk.bgYellow("You don't have any item"));
      return;
    }

    if (title) {
      const item = items.find((currentItem) => currentItem.title === title);
      if (item) {
        console.log(item.title);
        return;
      }
      console.log(chalk.bgRed(`No item with tittle ${title} was found`));
      return;
    }
    items.forEach((currentItem) => {
      console.log(currentItem.title);
    });
  });



  // Update item
program
.command("update")
.description("Update specified item")
.option("-t, --title <title>", "Item title to be updated")
.option("-q, --quantity <quantity>", "Item quantity")
.option("-p, --unitprice <unitprice>", "Item unit price")
.action((options) => {
  const { title, quantity, unitprice } = options;
  const loadedItems = fs.readFileSync("./data/item.json", "utf-8");
  const items = JSON.parse(loadedItems);
  if (items.length === 0) {
    console.log(chalk.bgRed("No items to update"));
    return;
  }
  const item = items.find((currentItem) => currentItem.title === title);
  if (!item) {
    console.log(chalk.bgRed(`Item with title '${title}' not found`));
    return;
  }
  item.title = title;
  item.quantity = quantity;
  item.unitprice = unitprice;
  item.updatedAt = new Date();
  fs.writeFileSync("./data/item.json", JSON.stringify(items));
  console.log(chalk.bgGreen("Item updated successfully"));
});



program
  .command("delete")
  .description("Delete specified item")
  .option("-t, --title <title>", "Item title to be deleted")
  .action((options) => {
    const title = options.title;
    const loadedItems = fs.readFileSync("./data/item.json", "utf-8");
    const items = JSON.parse(loadedItems);
    if (items.length === 0) {
      console.log(chalk.bgRed("No items to delete"));
      return;
    }
    const remainingItems = items.filter(
      (currentItem) => currentItem.title !== title,
    );
    fs.writeFileSync("./data/item.json", JSON.stringify(remainingItems));
    console.log(
      chalk.bgGreen(`Item with title '${title}' deleted successfully`),
    );
  });



program.parse(process.argv);
