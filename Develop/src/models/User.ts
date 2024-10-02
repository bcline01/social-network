import { Schema, model, Document } from 'mongoose';
// user for controller

interface IUser extends Document {
    username: string;
    email: string;
    thoughts: Schema.Types.ObjectId[];
    friends: Schema.Types.ObjectId[];
    friendCount: number; // Virtual property for friend count
  }



  const userSchema = new Schema<IUser>(
    {
      username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      },
      thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Thought',
        },
      ],
      friends: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false,
    }
  );

  // Virtual property to get the friend count
userSchema.virtual('friendCount').get(function (this: IUser) {
    return this.friends.length;
  });

// Create the User model using the IUser interface and schema
const User = model<IUser>('User', userSchema);

export default User;
