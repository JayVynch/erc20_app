const { expect } = require("chai");
// const { ethers } = require("hardhat");

describe('DEX', () => { 
    let tokenSupply = "100";

    let token;
    let dex;

    let price = 100;

    let owner;
    let addr1;
    let addr2;

    before(async () => {
        [owner,addr1,addr2] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(tokenSupply);
        
        const DEX = await ethers.getContractFactory("DEX");
        dex = await DEX.deploy(token.target, price);
        
    })

    describe ("sell", () => {
        it("should fail if contract is not approved", async() => {
           await expect(dex.sell()).to.be.reverted;
        }) 

        it("should allow dex to transfer token", async() => {
            token.approve(dex.target,100);
        }) 

        it("should not allow non-owner to call sell method", async() => {
            expect(dex.connect(addr1).sell()).to.be.reverted;
        }) 

        it("should allow sell from owner to contract", async() => {
            expect(dex.sell()).to.changeTokenBalances(token,[owner.address, dex.target],[-100,100]);
        }) 
    })

    describe ("getters", () => {
        it('should return the correct token balance', async () => {
            expect(await dex.getTokenBalance()).to.equal(100)
        })

        it('should return the correct token price', async () => {
            expect(await dex.getPrice(10)).to.equal(price * 10)
        })
    })

    describe ("buy", () => {
        
    })

    describe ("withdraw tokens", () => {
        
    })

    describe ("withdraw funds", () => {
        
    })
})