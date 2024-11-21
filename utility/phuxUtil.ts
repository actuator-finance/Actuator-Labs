require('dotenv').config();
import PHUX_VAULT_ABI from '../abi/phuxVaultABI.json';
import { ethers } from 'ethers'

const PHUX_VAULT_ADDRESS = '0x7F51AC3df6A034273FB09BB29e383FCF655e473c'

function getProvider() {
  return new ethers.JsonRpcProvider('https://rpc.pulsechain.com');
}

enum JoinKind {
  INIT,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
  ALL_TOKENS_IN_FOR_EXACT_BPT_OUT
}
type AddLiquidityParams = {
  poolId: string,
  assets: { amountIn: bigint, tokenAddress: string }[], // tokens must be sorted by token address
}
export async function addLiquidity(params: AddLiquidityParams) {
  const amounts = params.assets.map(a => a.amountIn)

  const coder = new ethers.AbiCoder();
  // https://docs.balancer.fi/reference/joins-and-exits/pool-joins.html#encoding
  const userData = coder.encode(
    [
      'uint256',   // Join Kind
      'uint256[]', // amounts
      'uint256'    // minimumBPT
    ],
    [
      JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT, // set to EXACT_TOKENS_IN_FOR_BPT_OUT for demonastration/simplicity but can be set as needed
      amounts, 
      1e6
    ],
  );
  const request = {
    assets: params.assets.map(a => a.tokenAddress),
    maxAmountsIn: amounts, // maxAmountsIn set to the same as amounts
    userData,
    fromInternalBalance: false 
  }

  const provider = getProvider()
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
  const vault = new ethers.Contract(PHUX_VAULT_ADDRESS, PHUX_VAULT_ABI, signer);
  const tx = await vault.joinPool(
    params.poolId,
    process.env.ADDRESS,
    process.env.ADDRESS,
    request
  );
  tx.wait().then(result => {
    console.log('Transaction complete:', result.hash)
  })
}

enum ExitKind {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
  EXACT_BPT_IN_FOR_TOKENS_OUT,
  BPT_IN_FOR_EXACT_TOKENS_OUT,
  MANAGEMENT_FEE_TOKENS_OUT // for InvestmentPool
}
type RemoveLiquidityParams = {
  poolId: string,
  assets: { address: string }[], // tokens must be sorted by token address
  lpAmount: bigint,
}
export async function removeLiquidity(params: RemoveLiquidityParams) {
  const coder = new ethers.AbiCoder();
  // https://docs.balancer.fi/reference/joins-and-exits/pool-exits.html#encoding
  const userData = coder.encode(
    [
      'uint256', 
      'uint256'
    ],
    [
      ExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT, // set to EXACT_BPT_IN_FOR_TOKENS_OUT for demonastration/simplicity but can be set as needed
      params.lpAmount // amount of BPT to withdraw
    ],
  );
  const request = {
    assets: params.assets.map(a => a.address),
    minAmountsOut: params.assets.map(() => 0n),
    userData,
    toInternalBalance: false,
  }

  const provider = getProvider()
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
  const vault = new ethers.Contract(PHUX_VAULT_ADDRESS, PHUX_VAULT_ABI, signer);
  const tx = await vault.exitPool(
    params.poolId,
    process.env.ADDRESS,
    process.env.ADDRESS,
    request
  );
  tx.wait().then(result => {
    console.log('Transaction complete:', result.hash)
  })
}