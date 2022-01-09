import { APIGatewayEvent } from "aws-lambda";

export interface BaseHTTPData {
  headers?: Object;
  body?: Object | string;
}

export interface CreateResInput extends BaseHTTPData {
  body?: Object;
  statusCode?: number;
}

export interface ReturnResHTTPData extends CreateResInput {
  headers: Object;
  body: string;
}

export interface APIGatewayEventIncludeDBName extends APIGatewayEvent {
  connectionName: string;
}
