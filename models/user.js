const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    profileImageURL: {
      type: String,
      default: "./public/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;
});

userSchema.static('matchPassword', async function(email, password){
    const user = await this.findOne({email})
    if(!user) throw new Error('user not found');

    const salt = user.salt;
    const hashedPassword= user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest("hex");

    if(hashedPassword !== userProvidedHash) throw new Error('incorrect password');

    return {...user, password:undefined, salt:undefined};
} )

const User = model("user", userSchema);

module.exports = User;
