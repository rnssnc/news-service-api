import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: () => void) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const { token } = JSON.parse(req.headers.authorization ? req.headers.authorization : '');
    if (!token) {
      res.status(401).json({ message: 'Нет авторизации' });
    }

    const decoded = jwt.verify(token, '123');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Нет авторизации' });
  }
};

export default auth;
