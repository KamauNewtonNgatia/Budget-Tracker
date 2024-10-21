import fs from 'fs';

function loadItems (path) {
     
    const loadedItems = fs.readFileSync(path, "utf8");
   if(!loadedItems){
    return []
   }
   return JSON.parse(loadedItems)
  
}

export default loadItems;