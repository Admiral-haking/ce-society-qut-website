import { Router, RequestHandler, Request } from 'express';
import { prisma } from "@/lib/prisma";

interface RequestWithUser extends Request {
  user?: { id: string };
}

const router = Router();

const verifyHandler: RequestHandler = (req, res) => {
  const { user } = req as RequestWithUser;
  if (!user) {
    res.status(401).json({ success: false, message: "ابتدا باید وارد شوید" });
    return;
  }

  const { amount } = req.body;

  // در اینجا باید منطق تایید پرداخت با درگاه پرداخت پیاده‌سازی شود
  // این یک نمونه ساده است

  prisma.payment
    .create({
      data: {
        amount,
        status: 'SUCCESS',
        userId: user.id, // نیاز به middleware برای احراز هویت
        type: 'COURSE_PURCHASE',
      },
    })
    .then((payment) => {
      res.json({ success: true, payment });
    })
    .catch((error) => {
      console.error('Payment verification error:', error);
      res.status(500).json({ success: false, message: 'خطا در تایید پرداخت' });
    });
};

const historyHandler: RequestHandler = (req, res) => {
  const { user } = req as RequestWithUser;
  if (!user) {
    res.status(401).json({ success: false, message: "ابتدا باید وارد شوید" });
    return;
  }

  prisma.payment
    .findMany({
      where: {
        userId: user.id, // نیاز به middleware برای احراز هویت
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then((payments) => {
      res.json({ success: true, payments });
    })
    .catch((error) => {
      console.error('Payment history error:', error);
      res.status(500).json({ success: false, message: 'خطا در دریافت تاریخچه پرداخت‌ها' });
    });
};

router.post('/verify', verifyHandler);
router.get('/history', historyHandler);

export default router;