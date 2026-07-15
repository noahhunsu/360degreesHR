import type { Prisma } from "@prisma/client";

export function formatCurrency(amount: Prisma.Decimal | number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(Number(amount));
}