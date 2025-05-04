import { signup, login } from '../app-auth/app-authentication';
import { User, IUser } from '../models/userModel';
import { DocumentModel } from '../models/documentModel';
// import { UserDocument } from '../models/userDocumentModel';
import { GraphQLJSON } from 'graphql-type-json';

export const authResolvers = {
  signup: async ({ name, email, password }: any) => {
    return signup({ name, email, password });
  },

  login: async ({ email, password }: any) => {
    return login({ email, password });
  },

  hello: () => 'Hello, world!',

  dashboard: (_: any, __: any, context: { user: { id: string } }) => {
    if (!context.user) throw new Error('Unauthorized');
    return `Hello user ${context.user.id}`;
  },

  linkDigilocker: async ({ userId }: { userId: string }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.digilockerLinked = true;
    user.digilockerLinkedAt = new Date();
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: user.digilockerLinkedAt ? user.digilockerLinkedAt.toISOString() : null,
    };
  },

  unlinkDigilocker: async ({ userId }: { userId: string }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.digilockerLinked = false;
    user.digilockerLinkedAt = null;
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: null,
    };
  },

  getUser: async ({ id }: any) => {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      digilockerLinked: user.digilockerLinked,
      digilockerLinkedAt: user.digilockerLinkedAt ? user.digilockerLinkedAt.toISOString() : null,
      lastDigilockerSyncedAt: user.lastDigilockerSyncedAt?.toISOString() || null,
    };
  },

  getUserDocuments: async ({ userId }: { userId: string }) => {
    // fetch all documents for this user
    return await DocumentModel.find({ userId }).lean();
    // return await UserDocument.find({ userId }).lean();
  },

  syncMockDocuments: async ({ userId }: { userId: string }) => {
    const mockDocs = [
      {
        userId,
        docId: 'DOC123',
        description: 'Class 12 Marksheet',
        docType: '12MARKSHEET',
        issueDate: new Date('2022-05-12'),
        issuerId: 'CBSE2022',
        orgId: '002317',
        orgName: 'CBSE Board',
        parameters: { rollNumber: '123456', centerCode: '110078' },
        udf1: 'PAN123456',
        verified: true,
      },
      {
        userId,
        docId: 'DOC456',
        description: 'Graduation Certificate',
        docType: 'DEGREE',
        issueDate: new Date('2024-06-30'),
        issuerId: 'XYZUNI1234',
        orgId: '008800',
        orgName: 'XYZ University',
        parameters: { enrollmentNo: 'UG20201234' },
        verified: false,
      },
    ];

    const savedDocs: any[] = [];

    for (const doc of mockDocs) {
      const exists = await DocumentModel.findOne({ userId, docId: doc.docId });
      if (!exists) {
        const created = await DocumentModel.create(doc);
        savedDocs.push(created);
      }
    }

    // update last synced timestamp
    const user = await User.findById(userId);
    if (user) {
      user.lastDigilockerSyncedAt = new Date();
      await user.save();
    }

    return {
      documents: savedDocs,
      lastSyncedAt: user?.lastDigilockerSyncedAt?.toISOString() || null,
    };
  },
};
