export const filterData = (data, value) => {
    let x = data;
    if (value.minIndex !== '') {
        x = this.filterMinFormula(x, value.minIndex);
        if (value.maxIndex !== '') {
            x = this.filterMaxFormula(x, value.maxIndex);
            if (value.minPrice !== '') {
                x = this.filterMinPrice(x, value.minPrice);
                if (value.maxPrice !== '') {
                    x = this.filterMaxPrice(x, value.maxPrice);
                    return x;
                } else {
                    return x;
                }
            } else {
                if (value.maxPrice !== '') {
                    x = this.filterMaxPrice(x, value.maxPrice);
                    return x;
                } else {
                    return x;
                }
            }
        } else {
            if (value.minPrice !== '') {
                x = this.filterMinPrice(x, value.minPrice);
                if (value.maxPrice !== '') {
                    x = this.filterMaxPrice(x, value.maxPrice);
                    return x;
                } else {
                    return x;
                }
            } else {
                if (value.maxPrice !== '') {
                    x = this.filterMaxPrice(x, value.maxPrice);
                    return x;
                } else {
                    return x;
                }
            }
        }
    } else {
        if (value.maxIndex !== '') {
            x = this.filterMaxFormula(x, value.maxIndex);
            if (value.minPrice !== '') {
                x = this.filterMinPrice(x, value.minPrice);
                if (value.maxPrice !== '') {
                    x = this.filterMaxPrice(x, value.maxPrice);
                    return x;
                } else {
                    return x;
                }
            } else {
                if (value.maxPrice !== '') {
                    x = this.filterMaxPrice(x, value.maxPrice);
                    return x;
                } else {
                    return x;
                }
            }
        } else {
            if (value.minPrice !== '') {
                x = this.filterMinPrice(x, value.minPrice);
                if (value.maxPrice !== '') {
                    x = this.filterMaxPrice(x, value.maxPrice);
                    return x;
                } else {
                    return x;
                }
            } else {
                if (value.maxPrice !== '') {
                    x = this.filterMaxPrice(x, value.maxPrice);
                    return x;
                } else {
                    return x;
                }
            }
        }
    }
}

filterMinFormula = (data, value) => {
    return data.filter((x) => x.formulaValue >= value)
}

filterMaxFormula = (data, value) => {
    return data.filter((x) => x.formulaValue <= value)
}

filterMinPrice = (data, value) => {
    return data.filter((x) => x.price_usd >= value)
}

filterMaxPrice = (data, value) => {
    return data.filter((x) => x.price_usd <= value)
}