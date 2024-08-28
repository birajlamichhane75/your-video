
const asyncHandler =  (fn) => async(req, res, next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.json({
            success:false,
            Message:'',
        })
        
    }
}

export {asyncHandler}