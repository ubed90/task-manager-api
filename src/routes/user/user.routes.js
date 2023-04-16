"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const fromModels = __importStar(require("../../models"));
const fromMiddleware = __importStar(require("../../middleware"));
const mongoose_1 = require("mongoose");
// For Handling Server side file Uploads
const multer_1 = __importDefault(require("multer"));
// For Handling Server Side Image Processing
const sharp_1 = __importDefault(require("sharp"));
// For Email
const fromEmail = __importStar(require("../../email"));
exports.userRoutes = (0, express_1.Router)();
// Signup Users
exports.userRoutes.post("", async (req, res) => {
    const user = new fromModels.User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        await fromEmail.sendWelcomeEmail(user.email, user.name);
        res.status(201).send({ user, token });
    }
    catch (error) {
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
exports.userRoutes.get("/profile", fromMiddleware.auth, async (req, res) => {
    res.status(200).send(res.locals.user);
});
// Login User
exports.userRoutes.post("/login", async (req, res) => {
    try {
        const user = await fromModels.User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});
// Logout User
exports.userRoutes.post("/logout", fromMiddleware.auth, async (req, res) => {
    try {
        const user = res.locals.user;
        const receivedToken = res.locals.token;
        user.tokens = user.tokens.filter((token) => {
            return token.token !== receivedToken;
        });
        await user.save();
        res.status(200).send("User Logged out Successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Logout All Sessions
exports.userRoutes.post("/logoutAll", fromMiddleware.auth, async (req, res) => {
    try {
        const user = res.locals.user;
        user.tokens = [];
        await user.save();
        res.status(200).send("User Logged out Successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
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
exports.userRoutes.patch("/profile", fromMiddleware.auth, async (req, res) => {
    const user = res.locals.user;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
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
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.status(200).send(user);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
// Update User Profile Picture
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image'));
        }
        callback(null, true);
    },
});
exports.userRoutes.post('/profile/avatar', fromMiddleware.auth, upload.single('upload'), async (req, res) => {
    const user = res.locals.user;
    // Previously- Storing Images in DB as Binary BLOBS
    // user.avatar = req.file?.buffer as Buffer
    // Now We will process and store images as Binary Blobs
    const buffer = await (0, sharp_1.default)(req.file?.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    user.avatar = buffer;
    await user.save();
    res.status(200).send(user);
}, (error, req, res, next) => {
    res.status(400).send(error.message);
});
// Delete User Profile Picture
exports.userRoutes.delete('/profile/avatar', fromMiddleware.auth, async (req, res) => {
    const user = res.locals.user;
    await user.updateOne({ $unset: { avatar: 1 } });
    res.status(204).send(user);
}, (error, req, res, next) => {
    res.status(400).send(error.message);
});
// Get Profile Picture in Browser
exports.userRoutes.get('/profile/:id/avatar', async (req, res) => {
    try {
        const user = await fromModels.User.findById(new mongoose_1.Types.ObjectId(req.params.id));
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }
    catch (error) {
        res.sendStatus(404);
    }
});
// Delete User
exports.userRoutes.delete("/profile", fromMiddleware.auth, async (req, res) => {
    const user = res.locals.user;
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
    }
    catch (error) {
        res.status(500).send();
    }
});
