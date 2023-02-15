import { BigNumber } from "ethers";

export interface NFTMintEngineDetail {
    maxSupply: number;
    totalSupply: number;
    price: number;
    saleStep: number;
}

export interface NFTStakingEngineDetail {
    earned: number;
    currentNFTList: BigNumber[];
    stakedNFTList_Day: BigNumber[];
    stakedNFTList_Week: BigNumber[];
    stakedNFTList_Month: BigNumber[];
    lastUpdatedForDay: number;
    lastUpdatedForWeek: number;
    lastUpdatedForMonth: number;
    dailyTokenRewardsForDay: number;
    dailyTokenRewardsForWeek: number;
    dailyTokenRewardsForMonth: number;
}