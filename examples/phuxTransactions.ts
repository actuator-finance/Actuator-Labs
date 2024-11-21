import { addLiquidity, removeLiquidity } from '../utility/phuxUtil';

/*
  - In order run, execute one of the scripts found in package.json
  - Be sure to set token approvals before calling addLiquidity or removeLiquidity to enable Phux vault to transfer tokens
  - Be sure to set address and private key in .env file
  - Be sure to set the desired add/remove amounts for each token in the params
*/

export async function addACTRLiquidity() {
  await addLiquidity({ 
    poolId: '0x01e0DD9a3CDDf8aE71F6D1793E1446D9BC193BF3000100000000000000000452', 
    assets: [ // be sure to set the desired add amounts for each token
      {amountIn: 100000000n, tokenAddress: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39' }, // HEX
      {amountIn: 0n, tokenAddress: '0x85DF7cE20A4CE0cF859804b45cB540FFE42074Da' }, // ACTR
      {amountIn: 0n, tokenAddress: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27' }, // WPLS
    ], 
  })
}

export async function removeACTRLiquidity() {
  await removeLiquidity({ 
    poolId: '0x01e0DD9a3CDDf8aE71F6D1793E1446D9BC193BF3000100000000000000000452', 
    assets: [
      { address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39' }, // HEX
      { address: '0x85DF7cE20A4CE0cF859804b45cB540FFE42074Da' }, // ACTR
      { address: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27' }, // WPLS
    ],
    lpAmount: 100000000000000000n, // be sure to set the desired add amount
  })
}

export async function addHexComplexLiquidity() {
  await addLiquidity({ 
    poolId: '0xbcce7cb56218e7ced5be2c5ec0bf9b84783a69ad000100000000000000000453', 
    assets: [ // be sure to set the desired add amounts for each token
      {amountIn: 0n, tokenAddress: '0x0d86EB9f43C57f6FF3BC9E23D8F9d82503f0e84b' }, // MAXI
      {amountIn: 100000000n, tokenAddress: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39' }, // HEX
      {amountIn: 0n, tokenAddress: '0x47810bb3ECDc6b080CeB2d39E769F21Ff14AB7E9' }, // HTT-7000
      {amountIn: 0n, tokenAddress: '0x6b32022693210cD2Cfc466b9Ac0085DE8fC34eA6' }, // DECI
      {amountIn: 0n, tokenAddress: '0xE2D03779147A32064511dd2b9D37F66f3EeFAd7C' }, // HTT-5000
      {amountIn: 0n, tokenAddress: '0xE9E1340A2b31d5D2a2dB28FB854a794E106b430a' }, // HTT-3000
    ], 
  })
}

export async function removeHexComplexLiquidity() {
  await removeLiquidity({ 
    poolId: '0xbcce7cb56218e7ced5be2c5ec0bf9b84783a69ad000100000000000000000453', 
    assets: [
      { address: '0x0d86EB9f43C57f6FF3BC9E23D8F9d82503f0e84b' }, // MAXI
      { address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39' }, // HEX
      { address: '0x47810bb3ECDc6b080CeB2d39E769F21Ff14AB7E9' }, // HTT-7000
      { address: '0x6b32022693210cD2Cfc466b9Ac0085DE8fC34eA6' }, // DECI
      { address: '0xE2D03779147A32064511dd2b9D37F66f3EeFAd7C' }, // HTT-5000
      { address: '0xE9E1340A2b31d5D2a2dB28FB854a794E106b430a' }, // HTT-3000
    ],
    lpAmount: 100000000000000000n, // be sure to set the desired add amount
  })
}

const [,,scriptCode] = process.argv;
async function main() {
  try {
    if (scriptCode === 'addACTRLiquidity') {
      await addACTRLiquidity()
    } else if (scriptCode === 'removeACTRLiquidity') {
      await removeACTRLiquidity()
    } else if (scriptCode === 'addHexComplexLiquidity') {
      await addHexComplexLiquidity()
    } else if (scriptCode === 'removeHexComplexLiquidity') {
      await removeHexComplexLiquidity()
    } else {
      throw `Invalid script code: ${scriptCode}`;
    }
  } catch (e) {
    console.log('Script Failed: ', e.stack);
  } 
}

main()
