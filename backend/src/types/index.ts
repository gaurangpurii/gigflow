import { Request } from 'express';
import { Types } from 'mongoose';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
  createdAt: Date;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: Types.ObjectId;
  createdAt: Date;
}

export interface AuthRequest extends Request<ParamsDictionary, any, any, ParsedQs> {
  user?: {
    id: string;
    role: 'admin' | 'sales';
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  status?: string;
  source?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
}