import { Request, Response, Router } from 'express';
import { CallbackError } from 'mongoose';

import Articles from '../models/article';

export type TCategory = 'general' | 'business' | 'entertainment' | 'health' | 'science' | 'sports' | 'technology';

export interface IArticle {
  source: {
    id: string | null,
    name: string,
    },
    author: string | null,
    title: string,
    description: string | null,
    url: string,
    urlToImage: string | null,
    publishedAt: string,
    content: string | null,
    category: TCategory,
}

export const articlesRouter = Router();

articlesRouter.get('/', async (req: Request, res: Response) => {
  const { _page, _limit, _category } = req.query;

  const pageOptions = {
    page: Number(_page) || 0,
    limit: Number(_limit) || 4,
    category: _category || 'general',
  };

  if (pageOptions.page === -1) {
    const data = await Articles.find();
    res.status(200).json(data);
    return;
  }

  Articles.find({ category: pageOptions.category })
    .skip(pageOptions.page * pageOptions.limit)
    .sort({ publishedAt: 'desc' })
    .limit(pageOptions.limit)
    .exec(async (err: CallbackError, articles: IArticle) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      const docCount = await Articles.countDocuments({ category: pageOptions.category }).exec();

      res.status(200).json({
        status: 'ok',
        page: pageOptions.page,
        totalDocuments: docCount,
        articles,
      });
    });
});

export default articlesRouter;
