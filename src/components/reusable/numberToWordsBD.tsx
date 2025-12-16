export function numberToWordsBD(num: number): string {
    if (num === 0) return "Zero";

    const belowTwenty = [
        "", "one", "two", "three", "four", "five", "six",
        "seven", "eight", "nine", "ten", "eleven", "twelve",
        "thirteen", "fourteen", "fifteen", "sixteen",
        "seventeen", "eighteen", "nineteen"
    ];

    const tens = [
        "", "", "twenty", "thirty", "forty", "fifty",
        "sixty", "seventy", "eighty", "ninety"
    ];

    function convertHundreds(n: number): string {
        let str = "";

        if (n > 99) {
            str += belowTwenty[Math.floor(n / 100)] + " hundred";
            n %= 100;
            if (n) str += " ";
        }

        if (n < 20) {
            str += belowTwenty[n];
        } else {
            str += tens[Math.floor(n / 10)];
            if (n % 10) str += "-" + belowTwenty[n % 10];
        }

        return str;
    }

    const crore = Math.floor(num / 10000000);
    num %= 10000000;

    const lakh = Math.floor(num / 100000);
    num %= 100000;

    const thousand = Math.floor(num / 1000);
    num %= 1000;

    const hundredPart = num;

    let words = "";

    if (crore) words += convertHundreds(crore) + " crore ";
    if (lakh) words += convertHundreds(lakh) + " lakh ";
    if (thousand) words += convertHundreds(thousand) + " thousand ";
    if (hundredPart) words += convertHundreds(hundredPart);

    // Capitalize first letter
    const result = words.trim();
    return result.charAt(0).toUpperCase() + result.slice(1);
}
