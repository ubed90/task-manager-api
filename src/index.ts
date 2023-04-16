import mainApp from "./app";

// app.use((req: Request, res: Response, next: NextFunction) => {
//     if(req.method === 'GET') {
//         res.status(400).send("GET REQUESTS ARE DISABLED")
//     } else {
//         next();
//     }

// });

const port = process.env.PORT;

mainApp.listen(port, () => {
    console.log("Server is up on port ", port);
})