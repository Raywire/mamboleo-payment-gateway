import http from 'http';
import app from '../app';

const PORT = parseInt(process.env.PORT, 10) || 8000;
app.set('port', PORT);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
