import { NextFunction, Request, Response, Router } from "express";
import * as fromModels from '../../models';
import * as fromMiddleware from "../../middleware";
import { HydratedDocument, Types as MongoFieldTypes } from "mongoose";


// For Handling Server side file Uploads
import multer from "multer";

// For Handling Server Side Image Processing
import sharp from "sharp";


// For Email
import * as fromEmail from '../../email';

export const userRoutes: Router = Router();

// Signup Users

userRoutes.post("", async (req: Request, res: Response) => {
  const user = new fromModels.User<fromModels.IUser>(req.body);

  try {
    await user.save();
    await fromEmail.sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read Users

// userRoutes.get("", fromMiddleware.auth ,async (req: Request, res: Response) => {
//   try {
//     const users: fromModels.IUser[] = await fromModels.User.find({});
//     res.status(200).send(users);
//   } catch (error) {
//     res.send(500).send();
//   }
// });


// Profile Route
userRoutes.get("/profile", fromMiddleware.auth ,async (req: Request, res: Response) => {
  res.status(200).send(res.locals.user);
});


// Login User
userRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await fromModels.User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error:any) {
    res.status(400).send({error: error.message});
  }
})


// Logout User
userRoutes.post("/logout", fromMiddleware.auth, async (req: Request, res: Response) => {
  try {
    const user: any = res.locals.user;
    const receivedToken = res.locals.token;
    user.tokens = user.tokens.filter((token: any) => {
      return token.token !== receivedToken
    });

    await user.save()

    res.status(200).send("User Logged out Successfully.");
  } catch (error) {
    res.status(500).send(error);
  }
})

// Logout All Sessions
userRoutes.post("/logoutAll", fromMiddleware.auth, async (req: Request, res: Response) => {
  try {
    const user: any = res.locals.user;
    user.tokens = [];

    await user.save();

    res.status(200).send("User Logged out Successfully.");
  } catch (error) {
    res.status(500).send(error);
  }
})

// Read User By ID

// userRoutes.get("/:id", async (req: Request, res: Response) => {
//   const _id = req.params.id;

//   // validate params
//   if (!isValidObjectId(_id)) {
//     // the function we need to write
//     return res.status(404).send("Invalid params"); // you can define your status and message
//   }

//   try {
//     const userId = new Types.ObjectId(_id);
//     const user = await fromModels.User.findById(userId);
//     if (!user) {
//       return res.status(404).send("User Not Found");
//     }

//     res.status(200).send(user);
//   } catch (error) {
//     res.status(500);
//   }
// });



// Update USER by ID

userRoutes.patch("/profile", fromMiddleware.auth , async (req: Request, res: Response) => {
  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  // Not required, Since this will only run with Authenticated Users

  // const _id = req.params.id;

  // if (!isValidObjectId(_id)) {
  //   return res.status(404).send("Invalid User Id");
  // }

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update operation!" });
  }

  try {
    // const userId = new Types.ObjectId(_id);

    // Adjustment for catching in our middleware, // Not required, Since this will only run with Authenticated Users

    // const user = await fromModels.User.findById(userId);

    // const user = await fromModels.User.findByIdAndUpdate(userId, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // if (!user) {
    //   return res.status(404).send("User Not Found");
    // }


    updates.forEach(update => user[update] = req.body[update])

    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Update User Profile Picture
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Please upload an image'));
    }

    callback(null, true)
  }, 
});

userRoutes.post('/profile/avatar', fromMiddleware.auth ,upload.single('upload'), async (req: Request, res: Response) => {
  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;
  

  // Previously- Storing Images in DB as Binary BLOBS
  // user.avatar = req.file?.buffer as Buffer

  // Now We will process and store images as Binary Blobs
  const buffer: Buffer = await sharp(req.file?.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  user.avatar = buffer;
  await user.save();


  res.status(200).send(user);
}, (error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(error.message);
});


// Delete User Profile Picture
userRoutes.delete('/profile/avatar', fromMiddleware.auth, async (req: Request, res: Response) => {
  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;
  await user.updateOne({ $unset: { avatar: 1 } });


  res.status(204).send(user);
}, (error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(error.message);
});


// Get Profile Picture in Browser
userRoutes.get('/profile/:id/avatar', async (req: Request, res: Response) => {
  try {
    const user = await fromModels.User.findById<fromModels.IUser>(new MongoFieldTypes.ObjectId(req.params.id));

    if(!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.sendStatus(404);
  }
});


// Delete User

userRoutes.delete("/profile", fromMiddleware.auth, async (req: Request, res: Response) => {
  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;

  
  // Not required, Since this will only run with Authenticated Users
  
  //const _id = res.locals.user._id;
  // if (!isValidObjectId(_id)) {
  //   return res.status(404).send("Invalid User Id");
  // }

  try {
    // const userId = new Types.ObjectId(_id);
    // const user = await fromModels.User.findByIdAndDelete(userId);
    // if (!user) {
      // return res.status(404).send("User Not Found");
    // }

    await user.deleteOne();

    await fromEmail.sendCancellationEmail(user.email, user.name);

    res.status(200).send(user);
  } catch (error) {
    res.status(500);
  }
});