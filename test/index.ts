import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, Contract } from "ethers";
import { ethers } from "hardhat";
import { buildSignatureData } from "../scripts/buildData";
import { splitSignature } from "ethers/lib/utils";

describe("TokenPermit Test", function () {
  let tokenPermit: Contract, signers: Array<SignerWithAddress>;
  const CONTRACT_NAME: string = "TokenPermitToken";
  const CONTRACT_SYMBOL: string = "TPMT";
  const SUPPLY: BigNumberish = 1000;
  let owner: SignerWithAddress;
  let verifyingContract: string;
  let spender: SignerWithAddress;
  this.beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    spender = signers[1];
    const TokenPermit = await ethers.getContractFactory("TokenPermit");
    tokenPermit = await TokenPermit.connect(owner).deploy(
      CONTRACT_NAME,
      CONTRACT_SYMBOL,
      SUPPLY
    );
    await tokenPermit.deployed();
    verifyingContract = tokenPermit.address;
    console.log("TokenPermit was deployed to:", verifyingContract);
  });

  it("Should execute approve + transferFrom using the EIP-712 standard", async function () {
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const ownerAddr = await owner.getAddress();
    const spenderAddr = await spender.getAddress();
    const nonce = await tokenPermit.nonces(ownerAddr);
    const deadline = 1682274605;
    const typedData = await buildSignatureData(
      CONTRACT_NAME,
      "1",
      chainId,
      verifyingContract,
      ownerAddr,
      spenderAddr,
      100,
      nonce.toNumber(),
      deadline
    );
    const signer = ethers.provider.getSigner();
    const signature = await signer.provider.send("eth_signTypedData_v4", [
      ownerAddr,
      JSON.stringify(typedData),
    ]);
    const { v, r, s } = splitSignature(signature);
    await tokenPermit
      .connect(spender)
      .permitWithTransfer(
        ownerAddr,
        spenderAddr,
        100,
        deadline,
        v,
        r,
        s,
        spenderAddr
      );
    const balance = await tokenPermit.balanceOf(spenderAddr);
    expect(balance).to.equal(100);
  });
});
