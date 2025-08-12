
export const getCategories = async (req, res) => {
    const msgJson = {
        status_code: 200,
        status_message: "OK",
        body_message: "The list of categories"
    };
    res.status(200).json(msgJson);
}

export const addCategories = async (req, res) => {
    const msgJson = {
        status_code: 200,
        status_message: "OK",
        body_message: "Add the new category"
    };
    res.status(200).json(msgJson);
}

export const updCategories = async (req, res) => {
    const msgJson = {
        status_code: 200,
        status_message: "OK",
        body_message: "Update a category"
    };
    res.status(200).json(msgJson);
}

export const delCategories = async (req, res) => {
    const msgJson = {
        status_code: 200,
        status_message: "OK",
        body_message: "Delete a category"
    };
    res.status(200).json(msgJson);
}

