const { server } = require('./server');

const port = 3030;
server.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});