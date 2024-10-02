import { Schema, model, Document, Types } from 'mongoose';

// Interface for Reaction
interface IReaction {
  reactionId: Types.ObjectId; 
  reactionBody: string; 
  username: string; 
  createdAt: Date; 
}

// Interface for Thought
interface IThought extends Document {
  thoughtText: string; 
  createdAt: Date; 
  username: string; 
  reactions: IReaction[]; 
  reactionCount: number;
}


const reactionSchema = new Schema<IReaction>(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(), 
      },
      reactionBody: {
        type: String,
        required: true,
        maxlength: 280, 
      },
      username: {
        type: String,
        required: true, 
      },
      createdAt: {
        type: Date, 
        default: Date.now,
    },
    {
      toJSON: {
        getters: true, // Ensure getters are included in JSON output
      },
      id: false, // Disable the default id field
    }
  );

const Course = model<ICourse>('Course', courseSchema);

export default Course;
