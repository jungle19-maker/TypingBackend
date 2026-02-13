const { env, db } = require('./src/config');
const app = require('./src/app');

// Connect to Database
db();

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
