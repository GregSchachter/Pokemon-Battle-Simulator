const { Router } = require("express");
const controller = require("../controller/Controller");
const corsMiddleware = require("../middleware/cors");

const router = Router();

router.get("/logout", controller.logout_get);
router.get("/me", controller.me_get);
router.get("/team", controller.team_get);
router.get("/trainer", controller.trainer_get);
router.get("/team/:teamName", controller.team_get_one);

router.post("/signup", controller.signup_post);
router.post("/login", controller.login_post);
router.post("/build", controller.build_post);
router.post("/comp", controller.comp_post);

router.put("/edit", controller.edit_patch);

router.delete("/team", controller.team_delete);

module.exports = router;
