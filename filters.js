class Filters {

    constructor(next = () => {}) {
        this.next = next;
    }

    #maxPrice;
    #isPriceHigher = (content) => this.#maxPrice && content.Price > this.#maxPrice;

    withMaxPriceFilter(maxPrice){
        this.#maxPrice = maxPrice;

        return this;
    }

    handle(content) {
        if (this.#isPriceHigher(content.content.raw.price)){
            return;
        }

        this.next(content);
    }
}

module.exports = Filters;