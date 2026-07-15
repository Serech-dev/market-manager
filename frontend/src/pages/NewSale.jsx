function NewSale() {
    return (
        <div>
            <h1>New Sale</h1>

            <form>
                <div>
                    <label>Description</label>
                    <input type="text" />
                </div>

                <div>
                    <label>Gross Amount</label>
                    <input type="number" />
                </div>

                <div>
                    <label>Investment Amount</label>
                    <input type="number" />
                </div>

                <button type="submit">
                    Save Sale
                </button>
            </form>
        </div>
    );
}

export default NewSale;