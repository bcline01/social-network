import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';



/**
 * GET All users
 * @returns an array of users
*/
export const getAllUsers = async(_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(error: any){
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET User based on id /user/:id
 * @param string id
 * @returns a single User object
*/
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId)
      .populate('thoughts')  
      .populate('friends'); 
      
      if(user) {
        res.json(user);
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  /**
 * POST User /users
 * @param object username
 * @returns a single User object
*/
export const createUser = async (req: Request, res: Response) => {
    const { username, email } = req.body;
    try {
      const newUser = await User.create({
        username, email
      });
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };

/**
 * PUT User based on id /users/:id
 * @param object id, username
 * @returns a single User object
*/
export const updateUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: username, email },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: 'user not found' });
      }

      res.json(updatedUser)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };

  /**
 * DELETE User based on id /users/:id
 * @param string id
 * @returns string 
*/
export const deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId});
      
      if(!user) {
        res.status(404).json({
          message: 'No user with that ID'
        });
      } else {
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User and associated thoughts deleted!' });
      }
      
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

/**
 * DELETE friend based on id /friend/:id
 * @param string id
 * @returns string 
*/

export const deleteFriend = async (req: Request, res: Response) => {
    try {
        const { userId, friendId } = req.params;

        // Find the user and remove the friend's ID from the friends array
        const user = await User.findByIdAndUpdate(
          userId,
          { $pull: { friends: friendId } }, // Use $pull to remove the friend
          { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: 'user not found',
            });
        }

        return res.json({ message: 'Friend successfully deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

/**
// POST /api/users/:userId/friends/:friendId
*/

export const addFriend = async (req: Request, res: Response) => {
    try {
        const { userId, friendId } = req.params;

        // Find the user and add the friend's ID to the friends array
        const user = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { friends: friendId } }, // Use $addToSet to avoid duplicates
          { new: true }
        );

        if (!user) {
            return res
                .status(404)
                .json({ message: 'user not found' });
        }

        return res.json(user);
    } catch (err: any) {
        return res.status(500).json(err);
    }
}


