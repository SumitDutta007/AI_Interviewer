import { cert, initializeApp } from 'firebase-admin/app';
import serviceAccount from "../serviceAccount.json" with { type: "json" };

export const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id
});
