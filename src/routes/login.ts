import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/users';

const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  if (!req.body) res.status(500).json({ message: 'Something went wrong' });

  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400).json({ message: 'Both fields required' });
    return;
  }

  const user = await User.findOne({ login });
  if (!user) {
    res.status(400).json({ message: 'Wrong data. Enter login: admin, password: admin' });
    return;
  }

  const isMatch = user.password === password;

  if (!isMatch) {
    res.status(400).json({ message: 'Incorrect password enter admin' });
    return;
  }

  const token = jwt.sign({ userLogin: user.login }, '123', {
    expiresIn: '1h',
  });
  res.status(200).json({ token, userLogin: user.login });
});

export default loginRouter;
