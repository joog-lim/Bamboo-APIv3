import { createConnection, getConnectionManager } from "typeorm";
import { Algorithm, AlgorithmStatus, Emoji, Question, User } from "../entity";
import { UnauthUser } from "../entity/UnauthUser";

export function connectTypeOrm(_: any, __: string, desc: PropertyDescriptor) {
  const originMethod = desc.value; // get function with a decorator on it.

  desc.value = async function (...args: any[]) {
    // argument override
    const connectionManager = getConnectionManager();
    let i = 0;
    for (; connectionManager.has(`connection${i}`); i++) {}
    const connection = await createConnection({
      name: `connection${i}`,
      type: "mysql",
      url: process.env.DB_URL,
      entities: [User, Emoji, Algorithm, AlgorithmStatus, Question, UnauthUser],
      logging: true,
      synchronize: false,
      database: "bamboo",
      timezone: "+09:00",
    });
    args[0].connectionName = `connection${i}`;

    // run function
    const result = await originMethod.apply(this, args);

    if (result) {
      await connection.close();
    }

    return result;
  };
}
