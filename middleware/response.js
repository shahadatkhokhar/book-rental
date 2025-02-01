module.exports = {
  response: (req, res) => {
    const results = Object.keys(res).reverse().slice(0, 4).reverse();
    console.log(results);
    if (!results.includes("data")) {
      res.success = false;
      results[0] = "success";
    } else res.success = true;
    if (res.code == 422) {
      delete res.success;
    }
    return res.status(res.code).json({
      success: res.success,
      code: res.code,
      message: res.message,
      data: res.data ? res.data : undefined,
      error: res.error ? res.error : undefined,
      errors: res.errors ? res.errors : undefined,
    });
  },

  error: async (res, error, req) => {
    let reqBody = JSON.stringify(req.body);
    res.stacktrace = error?.stack;
    console.error(
      `ERROR: ${error} \n RESPONSE: ${JSON.stringify(res.data)} \n ${
        error?.stack
      } \n REQUEST-BODY: ${reqBody || "none"}`
    );

    if (error.toString().includes("jwt malformed")) {
      res.success = false;
      res.code = 401;
      res.message = "JWT malformed";
      res.error = error.toString();
    } else {
      res.success = false;
      res.code = 500;
      res.message = "Something went wrong";
      res.error = error.toString();
    }
  },
};
