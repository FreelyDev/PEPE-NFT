import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import { currentNetwork, getContractObj } from ".";
import { NFTStakingEngineDetail, NFTMintEngineDetail } from "./typs";
import { RPC_URLS } from "./connectors";

export async function getMintEngineInfo() {
    const jsonProvider = new ethers.providers.JsonRpcProvider(RPC_URLS[currentNetwork]);
    const NFTContract = getContractObj('PEPE_NFT', currentNetwork, jsonProvider);
    try {
        const [
            maxSupply,
            totalSupply,
            price,
            saleStep
        ] = await Promise.all([
            NFTContract.MAX_SUPPLY(),
            NFTContract.totalSupply(),
            NFTContract.PUBLIC_PRICE(),
            NFTContract.SALE_STEP(),
        ]);

        const mintDetail: NFTMintEngineDetail = {
            maxSupply: maxSupply.toNumber(),
            totalSupply: totalSupply.toNumber(),
            price: parseFloat(ethers.utils.formatEther(price)),
            saleStep: saleStep.toNumber(),
        }

        return mintDetail;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function mintNFTs(chainId, provider, amount) {
    const NFTContract = getContractObj('PEPE_NFT', chainId, provider);
    try {
        const price: BigNumber = await NFTContract.PUBLIC_PRICE();
        const tx = await NFTContract.purchase(amount, {
            value: price.mul(amount)
        });
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}


export async function getStakingEngineInfo(account) {
    const jsonProvider = new ethers.providers.JsonRpcProvider(RPC_URLS[currentNetwork]);
    const NFTContract = getContractObj('PEPE_NFT', currentNetwork, jsonProvider);
    const TokenContract = getContractObj('PEP_Token', currentNetwork, jsonProvider);

    try {
        const [
            earned,
            currentNFTList,
            stakedNFTList_Day,
            stakedNFTList_Week,
            stakedNFTList_Month,
            userStakeInfo,
            dailyTokenRewardsForDay,
            dailyTokenRewardsForWeek,
            dailyTokenRewardsForMonth,
            tokenDecimals,
        ] = await Promise.all([
            account ? NFTContract.earnedForAll(account) : BigNumber.from(0),
            account ? NFTContract.userHoldNFTs(account) : [],
            account ? NFTContract.userStakedNFTsForDay(account) : [],
            account ? NFTContract.userStakedNFTsForWeek(account) : [],
            account ? NFTContract.userStakedNFTsForMonth(account) : [],
            account ? NFTContract.userStakeInfo(account) : null,
            NFTContract.dailyTokenRewardsForDay(),
            NFTContract.dailyTokenRewardsForWeek(),
            NFTContract.dailyTokenRewardsForMonth(),
            TokenContract.decimals(),
        ]);

        const stakingDetail: NFTStakingEngineDetail = {
            earned: parseFloat(ethers.utils.formatUnits(earned, tokenDecimals)),
            currentNFTList: currentNFTList,
            stakedNFTList_Day: stakedNFTList_Day,
            stakedNFTList_Week: stakedNFTList_Week,
            stakedNFTList_Month: stakedNFTList_Month,
            lastUpdatedForDay: userStakeInfo.lastUpdatedForDay,
            lastUpdatedForWeek: userStakeInfo.lastUpdatedForWeek,
            lastUpdatedForMonth: userStakeInfo.lastUpdatedForMonth,
            dailyTokenRewardsForDay: parseFloat(ethers.utils.formatUnits(dailyTokenRewardsForDay, tokenDecimals)),
            dailyTokenRewardsForWeek: parseFloat(ethers.utils.formatUnits(dailyTokenRewardsForWeek, tokenDecimals)),
            dailyTokenRewardsForMonth: parseFloat(ethers.utils.formatUnits(dailyTokenRewardsForMonth, tokenDecimals)),
        }

        return stakingDetail;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function stakeNFTs(chainId, provider, account, tokenIDList, period) {
    const NFTContract = getContractObj('PEPE_NFT', chainId, provider);
    try {
        const isApprovedForAll: boolean = await NFTContract.isApprovedForAll(account, NFTContract.address);
        if (isApprovedForAll !== true) {
            const tx1 = await NFTContract.setApprovalForAll(NFTContract.address, true);
            await tx1.wait(1);
        }

        if (period === "Day") {
            const tx2 = await NFTContract.stakeForDay(tokenIDList);
            await tx2.wait(1);
            return true;
        } else if (period === "Week") {
            const tx2 = await NFTContract.stakeForWeek(tokenIDList);
            await tx2.wait(1);
            return true;
        } else if (period === "Month") {
            const tx2 = await NFTContract.stakeForMonth(tokenIDList);
            await tx2.wait(1);
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
    return false;
}

export async function unstakeNFTs(chainId, provider, tokenIDList, period) {
    const NFTContract = getContractObj('PEPE_NFT', chainId, provider);
    try {
        if (period === "Day") {
            const tx2 = await NFTContract.unstakeForDay(tokenIDList);
            await tx2.wait(1);
            return true;
        } else if (period === "Week") {
            const tx2 = await NFTContract.unstakeForWeek(tokenIDList);
            await tx2.wait(1);
            return true;
        } else if (period === "Month") {
            const tx2 = await NFTContract.unstakeForMonth(tokenIDList);
            await tx2.wait(1);
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
    return false;
}

export async function claimReward(chainId, provider) {
    const NFTContract = getContractObj('PEPE_NFT', chainId, provider);
    try {
        const tx = await NFTContract.harvest();
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

