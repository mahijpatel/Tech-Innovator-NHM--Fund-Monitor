import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NHM Fund Monitor backend listening on port ${PORT}`);
});
