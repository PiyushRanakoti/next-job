import app from './app.js';

const port = process.env.PORT ?? 8080;

app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server', err);
    process.exit(1);
  }
  console.log(`Server listening on port ${port}`);
});
