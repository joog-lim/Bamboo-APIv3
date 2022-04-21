import { APIGatewayEvent } from "aws-lambda";
import { BaseAlgorithmDTO } from "../../DTO/algorithm.dto";
import { APIGatewayEventIncludeConnectionName } from "../../DTO/http.dto";
import {
  AuthMiddleware,
  DBMiddleware,
  AlgorithmMiddleware,
} from "../../middleware";
import { HttpErrorException } from "../../middleware/error";
import { getBody } from "../../util/req";
import { AlgorithmService } from "./algorithm.service";

export class AlgorithmRouter {
  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  @DBMiddleware.connectTypeOrm
  static async getAlgorithmByUser(event: APIGatewayEventIncludeConnectionName) {
    return AlgorithmService.getAlgorithmByIdx("user")(event);
  }
  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  @DBMiddleware.connectTypeOrm
  static async getAlgorithmListByUser(
    event: APIGatewayEventIncludeConnectionName,
  ) {
    return AlgorithmService.getAlgorithmList("user")(event);
  }

  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  @DBMiddleware.connectTypeOrm
  @AuthMiddleware.onlyAdmin
  static async getAlgorithmListByAdmin(
    event: APIGatewayEventIncludeConnectionName,
  ) {
    return AlgorithmService.getAlgorithmList("admin")(event);
  }

  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  @DBMiddleware.connectTypeOrm
  static async getAlgorithmCountAtAll({
    connectionName,
  }: APIGatewayEventIncludeConnectionName) {
    return AlgorithmService.getAlgorithmCountAtAll(connectionName);
  }

  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  static async getAlgorithmRules(_: APIGatewayEvent) {
    return AlgorithmService.getAlgorithmRules();
  }

  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  static async getAlgorithmRulesForWeb(_: APIGatewayEvent) {
    return AlgorithmService.getAlgorithmRulesForWeb();
  }

  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  @DBMiddleware.connectTypeOrm
  @AuthMiddleware.authUserByVerifyQuestionOrToken
  static async wirteAlgorithm(event: APIGatewayEventIncludeConnectionName) {
    return AlgorithmService.writeAlgorithm(
      getBody<BaseAlgorithmDTO>(event.body),
      event.connectionName,
    );
  }

  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  @DBMiddleware.connectTypeOrm
  @AlgorithmMiddleware.checkAlgorithm("param")
  static async setAlgorithmStatus(event: APIGatewayEventIncludeConnectionName) {
    return AlgorithmService.setAlgorithmStatus(event);
  }

  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  @DBMiddleware.connectTypeOrm
  @AuthMiddleware.onlyAdmin
  @AlgorithmMiddleware.checkAlgorithm("param")
  static async modifyAlgorithmContent(
    event: APIGatewayEventIncludeConnectionName,
  ) {
    return AlgorithmService.modifyAlgorithmContent(event);
  }

  @HttpErrorException
  @AuthMiddleware.onlyOrigin
  @DBMiddleware.connectTypeOrm
  @AuthMiddleware.onlyAdmin
  @AlgorithmMiddleware.checkAlgorithm("param")
  static async deleteAlgorithm(event: APIGatewayEventIncludeConnectionName) {
    return AlgorithmService.deleteAlgorithm(event);
  }
}
