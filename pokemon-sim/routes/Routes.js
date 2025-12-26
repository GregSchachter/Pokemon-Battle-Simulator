const { Router } = require("express");
const controller = require("../controller/Controller");

const router = Router();

router.get("/logout", controller.logout_get);
router.get("/me", controller.me_get);
router.get("/team", controller.team_get);
router.get("/trainer", controller.trainer_get);

router.post("/signup", controller.signup_post);
router.post("/login", controller.login_post);
router.post("/build", controller.build_post);
router.post("/comp", controller.comp_post);

router.delete("/team", controller.team_delete);

module.exports = router;
