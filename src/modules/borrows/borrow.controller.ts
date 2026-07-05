import type { Request, Response, NextFunction } from 'express'
import { BorrowService } from './borrow.service.js'
import type { CreateBorrowDto } from './borrow.dto.js'
import type { PaginationQuery } from '../users/user.dto.js'
import { sendSuccess, sendPaginated } from '../../utils/response.js'

export class BorrowController {
    private borrowservice : BorrowService

    constructor () {
        this.borrowservice = new BorrowService()
    }
    borrow = async (
        req: Request<{}, {}, CreateBorrowDto>,
        res: Response,
        next: NextFunction,
    )=> {
      try{
        const id = req.user!.userId
        const borrow = await this.borrowservice.borrowBook(id,req.body)
        sendSuccess(res, 201, "Book borrowed successfully", borrow)
      }catch(err){
        next(err)
      }
    }
    returnbook = async(
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) => {
       try{
        const borrowId = req.params.id
        const userId   = req.user!.userId
        const borrow   = await this.borrowservice.returnBook(borrowId, userId)
        sendSuccess(res, 200, 'Book returned successfully', borrow)
      }catch(err){
        next(err)
      }
    }
     myBorrows = async (
        req: Request,
        res: Response,
        next: NextFunction,
     ) => {
       try{
         const id = req.user!.userId
         const borrow = await this.borrowservice.myActiveBorrows(id)
        sendSuccess(res, 200, "The all myactive", borrow);
       }catch(err){
         next(err)
       }
     }
     myHistory = async (
        req: Request,
        res: Response,
        next: NextFunction,
     )=> {
        try{
           const id = req.user!.userId
           const borrow = await this.borrowservice.myHistory(id)
           sendSuccess(res, 200, "All history", borrow);
        }catch(err){
            next(err)
        }
     }
     overdue = async (
       req: Request,
       res: Response,
       next: NextFunction,
     )=> {
       try {
           const borrow = await this.borrowservice.overdue()
           sendSuccess(res, 200, "you are in the overdue", borrow);
        }catch(err){
            next(err)
        }
     }
     getAll = async (
    req: Request<{}, {}, {}, PaginationQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.borrowservice.findAll(page, limit);
      sendPaginated(res, "borrow fetched", result.data, result.meta);
    } catch (err) {
      next(err);
    }
  };
}