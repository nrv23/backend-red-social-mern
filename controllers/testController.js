

const test_api = async (req, res) => {

    console.log("servicio de prueba");

    //res.send("test")

    res.status(200).json({
        test: "test"
    })
}





module.exports = {
    test_api
}