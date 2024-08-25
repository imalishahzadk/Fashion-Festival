import { catchAsyncError } from "../../../middleware/catchAsyncError.js"
import { AppError } from "../../../utilits/AppError.js"
import userModel from "../../../dataBase/models/user.model.js"




 
export const addAddress = catchAsyncError(async(req,res,next)=>{
   const result = await userModel.findByIdAndUpdate(req.user._id,{$push:{addresses:req.body}},{new:true})
   !result && next (new AppError(`can't add to address`,404))
    result && res.json({messaeg:'success',result:result.addresses})
} )  

export const removeAddress = catchAsyncError(async(req,res,next)=>{
    const result = await userModel.findByIdAndUpdate(req.user._id,{$pull:{addresses:{_id:req.params.id}}},{new:true})
    !result && next (new AppError(`can't add to address`,404))
     result && res.json({messaeg:'success',result:result.addresses})
} )
export const getAllAddresses = catchAsyncError(async(req,res,next)=>{
    const result = await userModel.find()
    !result && next (new AppError(`can't add to address`,404))
     result && res.json({messaeg:'success',result:result.addresses})
} )

export const getAddress = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params
    let text = id.toString();

    const result = await userModel.findById(req.user._id)
    !result && next (new AppError(`can't get address`,404))
    const test =result.addresses.map((elm)=>elm._id)
    console.log(test.map((elm)=>elm==new ObjectId(text)))
    result && res.json({messaeg:'success',result:result})
})
 


