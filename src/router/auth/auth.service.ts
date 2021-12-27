import { APIGatewayEvent } from "aws-lambda";
import { getRepository, TransactionAlreadyStartedError } from "typeorm";
import jwt from "jsonwebtoken";

import { QuestionDTO } from "../../DTO/question.dto";
import { Question } from "../../entity";
import { createErrorRes, createRes } from "../../util/http";
import { User } from "../../entity";
import { authGoogleToken, getIdentity } from "../../util/verify";
import {
  BaseTokenDTO,
  IdentityType,
  RefreshTokenDTO,
} from "../../DTO/user.dto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../util/token";
import { TIME_A_WEEK } from "../../config";

export const AuthService: { [k: string]: Function } = {
  addVerifyQuestion: async ({ question, answer }: QuestionDTO) => {
    if (!question || !answer) {
      return createErrorRes({ status: 400, errorCode: "JL003" });
    }
    try {
      await getRepository(Question).insert({ question, answer });
      return createRes({ statusCode: 201 });
    } catch (e: unknown) {
      console.error(e);
      return createErrorRes({ status: 500, errorCode: "JL004" });
    }
  },

  getVerifyQuestion: async () => {
    const repo = getRepository(Question);

    const count = await repo.count();
    const random: number = ~~(Math.random() * count);
    try {
      return createRes({
        body: (
          await repo.find({ select: ["id", "question"], skip: random, take: 1 })
        )[0],
      });
    } catch (e: unknown) {
      console.error(e);
      return createErrorRes({ status: 500, errorCode: "JL004" });
    }
  },

  getTokenByRefreshToken: async (token: string) => {
    const data = verifyToken(token) as BaseTokenDTO;

    if (data.tokenType !== "RefreshToken") {
      return createErrorRes({ errorCode: "JL009", status: 401 });
    }

    const repo = getRepository(User);

    const { email, isAdmin, nickname, identity } = (
      await repo.find({ email: (data as RefreshTokenDTO).email })
    )[0];

    const accessToken: string = generateAccessToken({
      email,
      isAdmin,
      nickname,
      identity,
    });

    if (~~(new Date().getTime() / 1000) > data.exp - TIME_A_WEEK) {
      token = generateRefreshToken(data.email);
    }

    return createRes({ body: { accessToken, refreshToken: token } });
  },

  login: async (event: APIGatewayEvent) => {
    const token: string =
      event.headers.Authorization ?? event.headers.authorization;

    if (!token) {
      return createErrorRes({
        errorCode: "JL005",
      });
    }
    let decoded;
    try {
      decoded = await authGoogleToken(token);
    } catch (e) {
      console.error(e);
      return createErrorRes({ errorCode: "JL006" });
    }
    const { email, sub, name } = decoded;
    const identity: IdentityType = getIdentity(email);

    const repo = getRepository(User);
    const getUserSubId = await repo.find({
      select: ["subId"],
      where: { subId: sub },
    });
    try {
      if (getUserSubId.length === 0) {
        // Not found User
        await repo.insert({
          subId: sub,
          email: email,
          nickname: name,
          identity,
        });
      } else {
        await repo.update(
          {
            email: email,
          },
          {
            nickname: name,
            identity,
          }
        );
      }
    } catch (e) {
      console.error(e);
      return createErrorRes({ errorCode: "JL004", status: 500 });
    }

    const user = (await repo.find({ email }))[0];
    const accessToken = generateAccessToken({
      email,
      identity,
      nickname: name,
      isAdmin: user.isAdmin,
    });

    const refreshToken = generateRefreshToken(email);

    return createRes({
      body: {
        accessToken,
        refreshToken,
      },
    });
  },
};
