import express from "express";

export interface IRequest<T> extends express.Request {
  headers: {
    authorization: string;
  };
  body: { data: T };
}
export interface IRespond<T> extends express.Response {
  body: {
    code: number;
    message: string;
    data?: T;
  };
}
