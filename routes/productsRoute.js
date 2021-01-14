import express from "express";
import productsController from "../controllers/productsController";
import verifyAuth from "../middleware/verifyAuth";

const router = express.Router();

// products Routes

router.get("/", productsController.readAll);
router.get("/:productId", productsController.readOne);
router.post("/", verifyAuth, productsController.create);
router.put("/:productId", verifyAuth, productsController.update);
router.delete("/:productId", verifyAuth, productsController.delete);

export default router;
