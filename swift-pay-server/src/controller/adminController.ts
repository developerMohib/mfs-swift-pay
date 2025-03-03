import { Request, Response } from 'express';
import { Admin } from '../model/Admin';
import { comparePassword } from '../middleware/authMiddleware';

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({userEmail: email });

    if (!admin) {
      res.status(400).json({ message: 'Admin not found' });
      return;
    }

    // Verify pin
    const isMatch = await comparePassword(password, admin.password);
    console.log(19, isMatch);

    // if (!isMatch) {
    //   res.status(400).json({ message: 'Invalid credentials' });
    //   return;
    // }

    // Generate JWT token
    // const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.status(200).json({ message: 'Login successful', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const balanceInSystem = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json({
      balance: admin.balance,
      totalMoneyInSystem: admin.totalMoneyInSystem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
