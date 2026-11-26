declare global {
  namespace Express {
    interface Request {
      ctx?: {
        userId: string;
      };
    }
  }
}

export {};
