export const numberFormat = (num) =>{

    // Nine Zeroes for Billions
    return Number(num) >= 1.0e+9 
    ? (Number(num) / 1.0e+9 ).toFixed(2) + " B"
    : Number(num) >= 1.0e+8
        ? (Number(num) / 1.0e+6 ).toFixed(1) + " M"
        // Six Zeroes for Millions
        : Number(num) >= 1.0e+6
            ? (Number(num) / 1.0e+6 ).toFixed(2) + " M"
            // Three Zeroes for Thousands
            : Number(num) >= 1.0e+5
                ? (Number(num) / 1.0e+3 ).toFixed(1) + " K"
                // For one number after floating point
                : Number(num) >= 1.0e+2
                ? (Number(num)).toFixed(0) 
                                // For two number after floating point
                                : Number(num) >= 10
                                ? (Number(num)).toFixed(1) 
                                      // For six number after floating point
                                      : Number(num) >= 1
                                      ? (Number(num)).toFixed(2) 
                                              : Number(num) >= 0
                                              ? (Number(num)).toFixed(3) 
                                              : Number(num) <= 0
                                                 ? (Number(num)).toFixed(2) 
                                                 : Number(num); 
  }