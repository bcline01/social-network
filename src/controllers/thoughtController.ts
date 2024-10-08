import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

/**
 * GET All Thoughts
 
*/
export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
// GET /api/thoughts/:thoughtId
*/
export const getThoughtById = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findById(thoughtId);
    if(thought) {
      res.json(thought);
    } else {
      res.status(404).json({
        message: 'thought not found'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};

/**
* POST /api/thoughts
*/
export const createThought = async (req: Request, res: Response) => {
try {
  const { thoughtText, username, userId } = req.body;
  const newThought = await Thought.create({
    thoughtText,
    username,
    userId,  
  });
  await User.findByIdAndUpdate(userId, { $push: { thoughts: newThought._id } });

  res.status(201).json(newThought);
} catch (error: any) {
  console.log(error);
  
  res.status(400).json({
    message: error.message
  });
}
};

/**
* PUT /api/thoughts/:thoughtId
*/
export const updateThought = async (req: Request, res: Response) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updateThought) {
      res.status(404).json({ message: 'No thought with this id!' });
    }

    res.json(updatedThought)
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

/**
* DELETE /api/thoughts/:thoughtId
*/
export const deleteThought = async (req: Request, res: Response) => {
  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId});
    
    if(!deletedThought) {
      res.status(404).json({
        message: 'No thought with that ID'
      });
    }

    await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } }
    );

    res.json({ message: 'Thought deleted!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/thoughts/:thoughtId/reactions
export const addReaction = async (req: Request, res: Response) => {
  try {
    const { thoughtId } = req.params;
    const reaction = req.body; 

    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $addToSet: { reactions: reaction } }, 
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found :(' });
    }

    return res.json(thought);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


export const deleteReaction = async (req: Request, res: Response) => {
  try {
    const { thoughtId, reactionId } = req.params;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { reactionId: reactionId } } }, // Use $pull to remove the reaction
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({
        message: 'Thought not found',
      });
    }

    return res.json({ message: 'Reaction successfully deleted' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
