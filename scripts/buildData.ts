import { BigNumberish } from "ethers";

export const buildSignatureData = async (
  name: string,
  version: string,
  chainId: number,
  verifyingContract: string,
  owner: string,
  spender: string,
  value: number,
  nonce: number,
  deadline: BigNumberish
) => {
  return {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "Permit",
    domain: {
      name: name,
      version: version,
      chainId: chainId,
      verifyingContract: verifyingContract,
    },
    message: {
      owner: owner,
      spender: spender,
      value: value,
      nonce: nonce,
      deadline: deadline,
    },
  };
};
