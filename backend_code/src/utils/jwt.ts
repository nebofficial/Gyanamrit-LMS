import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface IJwtPayload {
  id: string;
  role: string;
}

const signToken = (data: IJwtPayload) => {
  if (!config.jsonSecretKey) {
    throw new Error("Secret Key not found.");
  }
  const token = jwt.sign(
    { id: data.id, role: data.role },
    config.jsonSecretKey,
    {
      expiresIn: "1days",
    }
  );
  return token;
};

export default signToken
