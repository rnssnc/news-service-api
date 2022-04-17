import { Request, Response, Router } from 'express';
import { CallbackError } from 'mongoose';
import { v2 as cloudinaryV2 } from 'cloudinary';
import path from 'path';
import fs from 'fs';

import loader from '../middleware/multer';
import auth from '../middleware/auth';
import Category from '../models/categories';
import Words from '../models/words';

const categoriesRouter = Router();

categoriesRouter.get('/', async (req: Request, res: Response) => {
  const { _page, _limit } = req.query;

  const pageOptions = {
    page: Number(_page) || 0,
    limit: Number(_limit) || 2,
  };

  if (pageOptions.page === -1) {
    const data = await Category.find();
    res.status(200).json(data);
    return;
  }

  Category.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec((err: CallbackError, categories: any) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      res.status(200).json(categories);
    });

  // res.send(pageOptions);
});

categoriesRouter.post('/', [auth, loader.single('image')], async (req: Request, res: Response) => {
  try {
    const data: {
      title: string;
      imgSrc?: string;
    } = {
      title: req.body.title,
    };

    if (req.file?.path) {
      const result = await cloudinaryV2.uploader.upload(
        path.join(req.file.destination, req.file.filename),
      );

      data.imgSrc = result.url;
    }

    Category.create(data, (err: CallbackError, category: any) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(category);
    });
  } catch (error) {
    res.send(error);
  }
  if (req.file?.path) {
    fs.unlink(path.join(req.file.destination, req.file.filename), (err) => {
      if (err) throw err;
    });
  }
});

categoriesRouter.put('/', [auth, loader.single('image')], async (req: Request, res: Response) => {
  Category.findOne({ title: req.body.title }, async (err: CallbackError, docs: any) => {
    if (docs && docs.id !== req.body.id) {
      res.status(409).json({ message: 'This name is already taken' });
      return;
    }

    try {
      const data: {
        title: string;
        imgSrc?: string;
      } = {
        title: req.body.title,
      };

      if (req.file?.path) {
        const result = await cloudinaryV2.uploader.upload(
          path.join(req.file.destination, req.file.filename),
        );

        data.imgSrc = result.url;
      }

      Category.findByIdAndUpdate(req.body.id, data, (error: CallbackError, categ: any) => {
        if (err) {
          res.status(500).json(error);
          return;
        }

        Words.updateMany(
          { category: categ.title },
          { category: req.body.title },
          null,
          (updateError: CallbackError) => {
            if (err) {
              console.log(updateError);
              return;
            }
            res.status(200).json({ ...req.body, _id: req.body.id, ...data });
          },
        );
      });
    } catch (error) {
      res.send(error);
    }
    if (req.file?.path) {
      fs.unlink(path.join(req.file.destination, req.file.filename), (error) => {
        if (error) throw err;
      });
    }
  });
});

categoriesRouter.delete('/', auth, (req: Request, res: Response) => {
  // eslint-disable-next-line no-underscore-dangle
  Category.findByIdAndDelete(req.body._id, null, (err: CallbackError, cat: any) => {
    if (err) {
      res.status(404).json(err);
      return;
    }

    res.status(200).json({ success: true });

    if (cat && cat.title) {
      Words.deleteMany({ category: cat.title }, undefined, (error: CallbackError) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });
});

export default categoriesRouter;
