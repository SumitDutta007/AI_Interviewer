import proxy from "express-http-proxy"

export const proxyWithHeaders = (serviceUrl) => {
    return proxy(
        serviceUrl,
        {
            proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
                // Add custom headers to the proxied request
                if(srcReq.user){
                    proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
                }
                return proxyReqOpts;
            }
        }
    )
}