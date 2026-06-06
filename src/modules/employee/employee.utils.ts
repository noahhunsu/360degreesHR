import crypto from "crypto"

function extractNumber(code: string | null) {
  if (!code) return 0;

  const match = code.match(/(\d+)$/);
  return match ? parseInt(match[1]!, 10) : 0;
}
export function generateEmployeeCode(lastCode: string | null) {
  const lastNumber = extractNumber(lastCode);
  const nextNumber = lastNumber + 1;

  return `EMP-${nextNumber.toString().padStart(4, "0")}`;
}

export const generateTemporaryPassword = () => {
  return crypto.randomBytes(8).toString("base64").slice(0, 12);
};