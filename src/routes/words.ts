/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
import { Router, Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import fs from 'fs';
import { v2 as cloudinaryV2 } from 'cloudinary';
import loader from '../middleware/multer';
import auth from '../middleware/auth';
import Words from '../models/words';
import Categories from '../models/categories';

const wordsRouter = Router();

wordsRouter.get('/:category/words', async (req: Request, res: Response) => {
  const { _page, _limit } = req.query;

  const pageOptions = {
    page: Number(_page) || 0,
    limit: Number(_limit) || 2,
  };

  const title = req.params.category.split('-').join(' ');

  if (!title) return res.status(404);

  if (pageOptions.page === -1) {
    const data = await Words.find({ category: title });
    res.status(200).json(data);
    return;
  }

  const category = await Categories.findOne({ title }, null, null, (error: CallbackError) => {
    console.log(error);
    return null;
  });

  if (!category) res.status(404).send({ message: 'category not found' });

  Words.find({ category: category.title })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec((err: CallbackError, data: any) => {
      if (err) {
        res.status(500).json(err);
      }
      res.status(200).json(data);
    });
});

wordsRouter.get('/:category/words/length', async (req, res) => {
  try {
    const { category } = req.params;
    const words = await Words.find({ category });

    res.json(words.length);
  } catch (err) {
    console.log(err);
  }
});

wordsRouter.post(
  '/:category/words',
  [
    auth,
    loader.fields([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  ],
  async (req: Request, res: Response) => {
    const title = req.params.category.split('-').join(' ');

    const category = await Categories.findOne({ title });

    if (!category) return res.status(404).send({ message: 'category not found' });

    try {
      const data: {
        word: string;
        translation: string;
        imgSrc?: string;
        audioSrc?: string;
        category: string;
      } = {
        word: req.body.word,
        translation: req.body.translation,
        category: req.body.category,
      };

      const files = req.files as any;

      if (files?.image && files?.image[0].path) {
        const result = await cloudinaryV2.uploader.upload(files?.image[0].path);

        data.imgSrc = result.url;
      }

      if (files?.audio && files?.audio[0].path) {
        const result = await cloudinaryV2.uploader.upload(files?.audio[0].path, {
          resource_type: 'video',
        });

        data.audioSrc = result.url;
      }

      Words.create(data, (err: CallbackError, word: any) => {
        if (err) {
          res.status(500).json(err);
          return;
        }

        res.status(200).json(word);
      });
    } catch (error) {
      res.send(error);
    }
    if (req.files) {
      const files = req.files as any;
      if (files?.image) {
        fs.unlink(files?.image[0].path, (err) => {
          if (err) throw err;
        });
      }
      if (files?.audio) {
        fs.unlink(files?.audio[0].path, (err) => {
          if (err) throw err;
        });
      }
    }
  },
);

wordsRouter.put(
  '/:category/words',
  [
    auth,
    loader.fields([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  ],
  async (req: Request, res: Response) => {
    const title = req.params.category.split('-').join(' ');

    const category = await Categories.findOne({ title });

    if (!category) return res.status(404).send({ message: 'category not found' });

    try {
      const data: {
        word: string;
        translation: string;
        imgSrc?: string;
        audioSrc?: string;
        category: string;
      } = {
        word: req.body.word,
        translation: req.body.translation,
        category: req.body.category,
      };

      const files = req.files as any;

      if (files?.image && files?.image[0].path) {
        const result = await cloudinaryV2.uploader.upload(files?.image[0].path);

        data.imgSrc = result.url;
      }

      if (files?.audio && files?.audio[0].path) {
        const result = await cloudinaryV2.uploader.upload(files?.audio[0].path, {
          resource_type: 'video',
        });

        data.audioSrc = result.url;
      }

      Words.findByIdAndUpdate(req.body.id, data, { new: true }, (err: CallbackError, word: any) => {
        if (err) {
          res.status(500).json(err);
          return;
        }

        res.status(200).json(word);
      });
    } catch (error) {
      res.send(error);
    }
    if (req.files) {
      const files = req.files as any;
      if (files?.image) {
        fs.unlink(files?.image[0].path, (err) => {
          if (err) throw err;
        });
      }
      if (files?.audio) {
        fs.unlink(files?.audio[0].path, (err) => {
          if (err) throw err;
        });
      }
    }
  },
);

wordsRouter.delete('/:category/words', auth, async (req: Request, res: Response) => {
  const title = req.params.category.split('-').join(' ');

  const category = await Categories.findOne({ title });

  if (!category) return res.status(404).send({ message: 'category not found' });

  try {
    Words.findByIdAndDelete(req.body._id, null, (err: CallbackError) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      res.status(200).json({ success: true });
    });
  } catch (error) {
    res.send(error);
  }
});

export default wordsRouter;
