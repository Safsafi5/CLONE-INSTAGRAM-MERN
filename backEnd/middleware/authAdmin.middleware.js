import User from "../models/user.model.js";


export const authAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({_id: req.user.id});
        if (!user || user.role !== 1) {
            return res.status(403).json({ msg: "Admin resources access denied" });
        } else {
            next();
        }
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}