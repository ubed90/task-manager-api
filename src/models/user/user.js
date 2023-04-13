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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
var fromMongoose = __importStar(require("mongoose"));
var validator_1 = __importDefault(require("validator"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var JWT = __importStar(require("jsonwebtoken"));
var task_1 = require("../task/task");
var userSchema = new fromMongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: function (value) {
            if (!validator_1.default.isEmail(value)) {
                throw new fromMongoose.Error(value + " is not a valid Email!.");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: function (value) {
            if (value.includes("password")) {
                throw new fromMongoose.Error("Password is too weak!");
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        validate: function (value) {
            if (value < 0) {
                throw new fromMongoose.Error("Age cannot be less than zero!");
            }
        },
    },
    avatar: {
        type: Buffer,
    },
    tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
}, {
    statics: {
        findByCredentials: function (email, password) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isMatch;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne({ email: email })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new Error('Email not found');
                            }
                            return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                        case 2:
                            isMatch = _a.sent();
                            if (!isMatch) {
                                throw new Error('Invalid Login credentials.');
                            }
                            return [2 /*return*/, user];
                    }
                });
            });
        }
    },
    timestamps: true
});
exports.userSchema = userSchema;
// Middleware Hooks
// Compare passwords while signing up
// userSchema.statics.findByCredentials = async (email: string, password: string) => {
//   const user = await User.findOne<IUser>({ email });
//   if(!user) {
//     throw new fromMongoose.Error('Email not found');
//   }
//   const isMatch = await bcrypt.compare(password, user.password);
//   if(!isMatch) {
//     throw new fromMongoose.Error('Invalid Login credentials.')
//   }
//   return user;
// }
// Defining relationship between User ans Tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});
// Declaring method which will be accessible on a Instance but not on whole Model
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var user, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = this;
                    token = JWT.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                    user.tokens = user.tokens.concat({ token: token });
                    return [4 /*yield*/, user.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, token];
            }
        });
    });
};
userSchema.method('toJSON', function () {
    var user = this;
    var publicUserData = user.toObject();
    // My Method
    // const { _id, name, email, age, __v } = userData;
    // const publicUserData: PublicData = { name, email, age, _id, __v }
    delete publicUserData.password;
    delete publicUserData.tokens;
    delete publicUserData.avatar;
    return publicUserData;
});
// Hash the plain Text passwords
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = this;
                    if (!user.isModified('password')) return [3 /*break*/, 2];
                    _a = user;
                    return [4 /*yield*/, bcrypt_1.default.hash(user.password, 8)];
                case 1:
                    _a.password = _b.sent();
                    _b.label = 2;
                case 2:
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
// Delete User Tasks when user is removed
userSchema.pre('deleteOne', { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = this;
                    return [4 /*yield*/, task_1.Task.deleteMany({ owner: user._id })];
                case 1:
                    _a.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
var User = fromMongoose.model("User", userSchema);
exports.User = User;
User.createIndexes();
// const data = new User({
//     name: 'Zaid',
//     email: 'zaid@gmail.com',
//     password: 'zaid@kela',
//     age: 25
// })
// data.save().then(console.log).catch(console.error);
