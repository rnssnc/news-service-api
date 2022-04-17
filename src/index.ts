import cors from 'cors';
import Express from 'express';
import Mongoose, { CallbackError } from 'mongoose';
import fetch from 'node-fetch';
import { v2 as cloudinaryV2 } from 'cloudinary';
import categoriesRouter from './routes/categories';
import wordsRouter from './routes/words';
import loginRouter from './routes/login';
import articlesRouter, { IArticle, TCategory } from './routes/articles';
import Articles from './models/article';

export interface INewsApiResponse {
  status: 'ok' | 'error',
  totalResults: number,
  articles: IArticle[],
}

// eslint-disable-next-line operator-linebreak
const MONGODB_URI =
  'mongodb+srv://rnssnc:uPFaycUD2JJE9XLS@cluster0.evpli.mongodb.net/bridge?retryWrites=true&w=majority';

// // eslint-disable-next-line operator-linebreak
// const CLOUDINARY_URI =
//   'CLOUDINARY_URL=cloudinary://868357599533181.JprxlqrNKX8zj9czoRhOfqrZROI@dg2m1u3bf';

const app = Express();

cloudinaryV2.config({
  cloud_name: 'dg2m1u3bf',
  api_key: '868357599533181',
  api_secret: 'JprxlqrNKX8zj9czoRhOfqrZROI',
});

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(Express.json()); // support json encoded bodies
app.use(Express.urlencoded({ extended: true })); // support encoded bodies

app.use('/', wordsRouter);
app.use('/categories', categoriesRouter);
app.use('/login', loginRouter);
app.use('/articles', articlesRouter);

app.get('/', (req: Express.Request, res: Express.Response) => {
  res.send('rnssnc');
});

const PORT = process.env.PORT || 80;

async function start() {
  try {
    await Mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    app.listen(PORT, async () => {
      console.log(`Server is running PORT ${PORT}`);

      const categories: TCategory[] = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

      categories.forEach(async (category: TCategory) => {
        await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&pageSize=100&country=ru&apiKey=54a679edafc74c43ab2b7370321ad562`)
          .then((res: any) => res.json())
          .then((data: INewsApiResponse) => {
            Articles.create(
              data.articles.map((article: IArticle) => {
                // eslint-disable-next-line no-param-reassign
                article.category = category;
                return article;
              }),
              (err: CallbackError, docs: any[]) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log(docs);
              },
            );
          });
      });
    });
  } catch (e) {
    console.log(e);
  }
}

start();
