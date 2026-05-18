

import app from "./app.js";

const PORT  = process.env.PORT || 3000; 

app.listen (PORT , () => {
    console.log(`Server is listening on port ${PORT}` )
        console.log("DATABASE_URL:", process.env.DATABASE_URL);

})