module.exports = {
    images: {
        remotePatterns: [
            { protocol: "http", hostname: "localhost", port: "5000", pathname: "/media/**" },
            { protocol: "http", hostname: "127.0.0.1", port: "5000", pathname: "/media/**" },
            // prod domain too:
            { protocol: "https", hostname: "tapstagram.com", pathname: "/media/**" },
            // ✅ S3 bucket (ADD THIS)
            {
                protocol: "https",
                hostname: "examinox.s3.us-east-1.amazonaws.com",
                pathname: "/**",
            },
        ],
    },
    reactStrictMode: true
};