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
        it("should allow user to buy tokens", async () => {
            await expect(dex.connect(addr1).buy(10,{value : 1000}))
            .to.changeTokenBalances(token,[dex.target,addr1.address],[-10,10])
        })

        it("should not allow user to buy invalid amount of tokens", async () => {
            await expect(dex.connect(addr1).buy(91,{value : 9100}))
            .to.be.reverted;
        })

        it("should not allow user to buy invalid value", async () => {
            await expect(dex.connect(addr1).buy(5,{value : 510}))
            .to.be.reverted;
        })
    })

    describe ("withdraw tokens", async() => {
        it("should not allow non-owner to withdraw of tokens", async () => {
            await expect(dex.connect(addr1).withdrawTokens())
            .to.be.reverted;
        })

        it("should allow owner to withdraw of tokens", async () => {
            await expect(dex.withdrawTokens())
            .to.changeTokenBalances(token,[dex.target,owner.address],[-90,90]);
        })
    })

    describe ("withdraw funds", async() => {
        it("should allow owner to withdraw funds", async () => {
            await expect(dex.withdrawFunds())
            .to.changeEtherBalances([dex.target,owner.address],[-1000,1000]);
        })

        it("should not allow non-owner to withdraw funds", async () => {
            await expect(dex.connect(addr1).withdrawFunds())
            .to.be.reverted;
        })
    })
})