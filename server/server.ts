import { app } from './app';
require('dotenv').config();



// Create a new server instance
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port :${process.env.PORT}`);
}
);