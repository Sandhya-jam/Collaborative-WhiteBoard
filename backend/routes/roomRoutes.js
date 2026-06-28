import express from "express";
import protect from "../middleware/authMiddleware.js"
import { createRoom,getMyRooms,renameRoom,deleteRoom} from "../controllers/roomControllers.js";

const router=express.Router();

router.post("/create",protect,createRoom);
router.get("/myrooms",protect,getMyRooms);
router.patch("/:id",protect,renameRoom);
router.delete("/:id",protect,deleteRoom);

export default router;