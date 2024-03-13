import express from 'express';
import appRoutes from './routes/index';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', appRoutes);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
