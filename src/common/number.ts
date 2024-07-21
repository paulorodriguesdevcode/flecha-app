export function toFormattedPrice(formattedPrice: string): number {
    const numericString = formattedPrice
        .replace("R$", "")
        .replace(".", "")
        .replace(",", ".");

    const numericValue = parseFloat(numericString);
    return parseFloat(numericValue.toFixed(2));
}
