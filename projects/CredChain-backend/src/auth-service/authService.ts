import { signup, login } from '../app-auth/app-authentication';
import { User, IUser } from '../models/userModel';
import { UserDocument } from '../models/documentModel';
import { GraphQLJSON } from 'graphql-type-json';

export const authResolvers = {
  signup: async ({ name, email, password }: any) => signup({ name, email, password }),

  login: async ({ email, password }: any) => login({ email, password }),

  hello: () => 'Hello, world!',

  dashboard: (_: any, __: any, context: { user: { id: string } }) => {
    if (!context.user) throw new Error("Unauthorized");
    return `Hello user ${context.user.id}`;
  },

  linkDigilocker: async ({ userId }: { userId: string }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.digilockerLinked = true;
    user.digilockerLinkedAt = new Date(); // 🕒 Save the timestamp
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: user.digilockerLinkedAt
        ? (user.digilockerLinkedAt as Date).toISOString()
        : null
    };
  },

  unlinkDigilocker: async ({ userId }: { userId: string }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.digilockerLinked = false;
    user.digilockerLinkedAt = null; // 🧹 Clear timestamp
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: user.digilockerLinkedAt
        ? (user.digilockerLinkedAt as Date).toISOString()
        : null
    };
  },

  getUser: async ({ id }: any) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: user.digilockerLinkedAt
        ? (user.digilockerLinkedAt as Date).toISOString()
        : null
    };
  },

  syncMockDocuments: async ({ userId }: { userId: string }) => {
    const mockDocs = [
      {
        userId,
        docId: "DOC123",
        description: "Class 12 Marksheet",
        docType: "12MARKSHEET",
        issueDate: new Date("2022-05-12"),
        issuerId: "CBSE2022",
        orgId: "002317",
        orgName: "CBSE Board",
        parameters: { rollNumber: "123456", centerCode: "110078" },
        udf1: "PAN123456",
        verified: true,
      },
      {
        userId,
        docId: "DOC456",
        description: "Graduation Certificate",
        docType: "DEGREE",
        issueDate: new Date("2024-06-30"),
        issuerId: "XYZUNI1234",
        orgId: "008800",
        orgName: "XYZ University",
        parameters: { enrollmentNo: "UG20201234" },
        verified: false,
      },
    ];

    const savedDocs = await UserDocument.insertMany(mockDocs);
    return savedDocs;
  },
};