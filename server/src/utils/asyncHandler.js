// express custom METHOD to wrap function

export const asyncHandler = (requestHandler)=>{
    return (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next))
        .catch(err=>next(err));
    }
};