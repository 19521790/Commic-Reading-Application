const express = require("express");
const router = express.Router();

const publishableKey = 'pk_test_51KFt1gF2EZ3ThaNawwPxRUmGLA4U5dM8EsJylkm4FsSLOaF12kMNknwGcr3PkIhDgfQWmPkeN6L06UlYODn5xQAb00EHXtzkKZ';
const secretKey = 'sk_test_51KFt1gF2EZ3ThaNaIhBhZKtGvI02LpTE3JXSMAGvXkfdtYrhQl3tBYmbsCDvruGSiSKiB9nzNOwPbk216b886v2800Dn3iPopg';

router.get("/", (req, res) => {
    res.json({
        publishableKey: publishableKey,
        secretKey: secretKey
    })
})

module.exports = router;