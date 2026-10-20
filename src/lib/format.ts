export const bnNumber = (value: number) =>
    new Intl.NumberFormat ("bn-BD", {
        maximumFractionDigits: 2, 
    }).format(value);
export const formatPrice = (value:number) =>
    `৳ ${bnNumber(value)}`;

export const formatChange = (value:number) =>
{
    const marker = value > 0 ? "▲" : value < 0 ? "▼" : "—";
    return `${marker} ${bnNumber(Math.abs(value))}%`;
};