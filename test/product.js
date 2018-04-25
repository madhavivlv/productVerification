var Product = artifacts.require("./Product.sol");

contract ("Product", function(accounts){

    it("initializes with 2 products",function()
{
    return Product.deployed().then(function(instance){
        return instance.productCount();
    }).then(function(count){
        assert.equal(count,3);
    });
});
});


