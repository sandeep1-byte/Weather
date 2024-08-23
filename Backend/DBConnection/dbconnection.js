import { log } from "console";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("wheatherapi","root","softude@123",{
    host:"localhost",
    dialect:'mysql',
})

sequelize.authenticate()
.then(()=>{
    console.log("Database Connected Successfully");
}).catch(()=>{
    console.log("error in database connection");
})

export default sequelize;