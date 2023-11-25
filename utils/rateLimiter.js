const { rateLimit } = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req) => {
        if (req.url === "/v1/users/login" || req.url === "/v1/users/register") { return 3 }
        else return 10
    },
    message: {
        status: "failed",
        message: "Too many requests!"
    }
})

module.exports = rateLimiter