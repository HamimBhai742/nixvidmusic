
import * as bcrypt from 'bcryptjs';
import config from '../../config';
import { UserRoleEnum } from '@prisma/client';
import { prisma } from '../utils/prisma';


const adminData = {
  name: ' Admin',
  email: config.admin.email,
  password: config.admin.password,
  role: UserRoleEnum.ADMIN,
  isEmailVerified: true,
};
// 
const seedAdmin = async () => {
  try {
    // Check if a super admin already exists
    const isAdminExists = await prisma.user.findFirst({
      where: {
        role: UserRoleEnum.ADMIN,
      },
    });

    // If not, create one
    if (!isAdminExists) {
      adminData.password = await bcrypt.hash(
        config.admin.password as string,
        Number(config.bcrypt_salt_rounds) || 12,
      );
      await prisma.user.create({
        data: adminData,
      });
      console.log(' Admin created successfully.');
    } else {
      return;
      //   console.log(" Admin already exists.");
    }
  } catch (error) {
    console.error('Error seeding  Admin:', error);
  }
};

export default seedAdmin;
