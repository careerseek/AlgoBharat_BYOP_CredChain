export interface UserDocument {
    id: string;
    userId: string;
    docId: string;
    description?: string;
    docType: string;
    issueDate: string; // GraphQL sends date as string
    issuerId: string;
    orgId: string;
    orgName: string;
    parameters?: Record<string, string>;
    udf1?: string;
    hash?: string;
    ipfsUrl?: string;
    verified: boolean;
}